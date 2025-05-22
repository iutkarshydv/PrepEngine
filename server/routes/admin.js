const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { users, saveUsersToFile } = require('../data/users');
const config = require('../config');
const fs = require('fs');
const path = require('path');

// Default admin settings
let adminSettings = {
    username: 'admin',
    sessionTimeout: 60, // minutes
    allowRegistration: true,
    allowContentSaving: true
};

// Try to load settings from file
try {
    const settingsPath = path.join(__dirname, '../data/admin-settings.json');
    if (fs.existsSync(settingsPath)) {
        const settingsData = fs.readFileSync(settingsPath, 'utf8');
        adminSettings = JSON.parse(settingsData);
    }
} catch (error) {
    console.error('Error loading admin settings:', error);
}

// Save settings to file
const saveSettingsToFile = () => {
    try {
        const settingsPath = path.join(__dirname, '../data/admin-settings.json');
        fs.writeFileSync(settingsPath, JSON.stringify(adminSettings, null, 2));
    } catch (error) {
        console.error('Error saving admin settings:', error);
    }
};

// Middleware to verify admin token
const verifyAdminToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    
    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        
        // Check if user exists and is an admin
        const user = users.find(u => u.id === decoded.id);
        if (!user || !user.isAdmin) {
            return res.status(403).json({ message: 'Access denied. Not an admin.' });
        }
        
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

// Admin login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    // Find admin user
    const adminUser = users.find(user => user.username === username && user.isAdmin);
    
    if (!adminUser) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, adminUser.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Create and sign JWT token with the configured session timeout
    const token = jwt.sign(
        { id: adminUser.id, isAdmin: true },
        config.jwtSecret,
        { expiresIn: `${adminSettings.sessionTimeout || 60}m` }
    );
    
    res.json({
        token,
        user: {
            id: adminUser.id,
            username: adminUser.username,
            name: adminUser.name,
            email: adminUser.email,
            isAdmin: adminUser.isAdmin
        }
    });
});

// Get all users (admin only)
router.get('/users', verifyAdminToken, (req, res) => {
    // Return users without passwords
    const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    });
    
    res.json({ users: usersWithoutPasswords });
});

// Get user by ID (admin only)
router.get('/users/:id', verifyAdminToken, (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
});

// Delete user (admin only)
router.delete('/users/:id', verifyAdminToken, (req, res) => {
    const userIndex = users.findIndex(u => u.id === req.params.id);
    
    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    // Don't allow deleting the current admin user
    if (users[userIndex].id === req.user.id) {
        return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    
    // Remove user from array
    users.splice(userIndex, 1);
    
    // Save changes to file
    saveUsersToFile();
    
    res.json({ message: 'User deleted successfully' });
});

// Get dashboard stats (admin only)
router.get('/stats', verifyAdminToken, (req, res) => {
    // Calculate stats
    const totalUsers = users.length;
    
    // Count unique courses
    const allCourses = [];
    users.forEach(user => {
        if (user.savedCourses) {
            allCourses.push(...user.savedCourses);
        }
    });
    
    // Use a Set to count unique courses by ID or name
    const uniqueCourses = new Set();
    allCourses.forEach(course => {
        uniqueCourses.add(course.courseId || course.courseName);
    });
    
    // Count total saved items across all users
    let totalSavedItems = 0;
    users.forEach(user => {
        totalSavedItems += (user.savedCourses || []).length;
        totalSavedItems += (user.savedNotes || []).length;
        totalSavedItems += (user.savedSyllabus || []).length;
        totalSavedItems += (user.savedPapers || []).length;
    });
    
    res.json({
        totalUsers,
        totalCourses: uniqueCourses.size,
        totalSavedItems
    });
});

// Get admin settings (admin only)
router.get('/settings', verifyAdminToken, (req, res) => {
    // Get admin user
    const adminUser = users.find(user => user.id === req.user.id);
    
    // Return settings with admin username
    res.json({
        ...adminSettings,
        username: adminUser.username
    });
});

// Update admin settings (admin only)
router.post('/settings', verifyAdminToken, async (req, res) => {
    const { username, currentPassword, newPassword, sessionTimeout, allowRegistration, allowContentSaving } = req.body;
    
    // Find admin user
    const adminUserIndex = users.findIndex(user => user.id === req.user.id);
    if (adminUserIndex === -1) {
        return res.status(404).json({ message: 'Admin user not found' });
    }
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, users[adminUserIndex].password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Update admin username if changed
    if (username && username !== users[adminUserIndex].username) {
        users[adminUserIndex].username = username;
    }
    
    // Update password if provided
    if (newPassword) {
        const salt = await bcrypt.genSalt(10);
        users[adminUserIndex].password = await bcrypt.hash(newPassword, salt);
    }
    
    // Update settings
    adminSettings = {
        ...adminSettings,
        sessionTimeout: sessionTimeout || 60,
        allowRegistration: allowRegistration !== undefined ? allowRegistration : true,
        allowContentSaving: allowContentSaving !== undefined ? allowContentSaving : true
    };
    
    // Save changes
    saveUsersToFile();
    saveSettingsToFile();
    
    // Create new token with updated settings
    const token = jwt.sign(
        { id: users[adminUserIndex].id, isAdmin: true },
        config.jwtSecret,
        { expiresIn: `${adminSettings.sessionTimeout || 60}m` }
    );
    
    res.json({
        message: 'Settings updated successfully',
        token
    });
});

// Create backup (admin only)
router.get('/backup', verifyAdminToken, (req, res) => {
    // Create a backup object with all data
    const backup = {
        users: users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }),
        settings: adminSettings,
        timestamp: new Date().toISOString()
    };
    
    res.json(backup);
});

// Clear all data (admin only)
router.post('/clear-data', verifyAdminToken, (req, res) => {
    // Keep only admin users
    const adminUsers = users.filter(user => user.isAdmin);
    
    // Clear all non-admin users
    users.length = 0;
    users.push(...adminUsers);
    
    // Save changes
    saveUsersToFile();
    
    res.json({ message: 'All data cleared successfully' });
});

// Add a new user (admin only)
router.post('/users', verifyAdminToken, async (req, res) => {
    const { name, email, username, password, isAdmin } = req.body;
    
    // Check if user already exists
    if (users.some(user => user.email === email || user.username === username)) {
        return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        username,
        password: hashedPassword,
        isAdmin: isAdmin === true,
        savedCourses: [],
        savedNotes: [],
        savedSyllabus: [],
        savedPapers: [],
        dateAdded: new Date().toISOString()
    };
    
    // Add user to array
    users.push(newUser);
    
    // Save changes
    saveUsersToFile();
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ user: userWithoutPassword });
});

// Update a user (admin only)
router.put('/users/:id', verifyAdminToken, async (req, res) => {
    const { name, email, username, password, isAdmin, active } = req.body;
    
    // Find user
    const userIndex = users.findIndex(u => u.id === req.params.id);
    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user fields
    if (name) users[userIndex].name = name;
    if (email) users[userIndex].email = email;
    if (username) users[userIndex].username = username;
    if (isAdmin !== undefined) users[userIndex].isAdmin = isAdmin;
    if (active !== undefined) users[userIndex].active = active;
    
    // Update password if provided
    if (password) {
        const salt = await bcrypt.genSalt(10);
        users[userIndex].password = await bcrypt.hash(password, salt);
    }
    
    // Save changes
    saveUsersToFile();
    
    // Return updated user without password
    const { password: _, ...userWithoutPassword } = users[userIndex];
    res.json({ user: userWithoutPassword });
});

module.exports = router;
