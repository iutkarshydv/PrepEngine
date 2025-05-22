// File-based users database for development
// This provides persistence between server restarts
// In a production environment, this would be replaced with a real database

const fs = require('fs');
const path = require('path');

// Path to the JSON database file
const dbPath = path.join(__dirname, 'db.json');

// Load users from file or create empty array if file doesn't exist
let users = [];

try {
    // Check if the file exists
    if (fs.existsSync(dbPath)) {
        const data = fs.readFileSync(dbPath, 'utf8');
        const db = JSON.parse(data);
        users = db.users || [];
        console.log(`Loaded ${users.length} users from database file`);
    } else {
        console.log('Database file not found, creating new one');
        saveUsers();
    }
} catch (err) {
    console.error('Error loading users from file:', err);
    // Continue with empty users array
}

// Function to save users to file
function saveUsers() {
    try {
        const db = { users };
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
        console.log(`Saved ${users.length} users to database file`);
    } catch (err) {
        console.error('Error saving users to file:', err);
    }
}

// Create a proxy to intercept array mutations and save to file
const usersProxy = new Proxy(users, {
    set(target, property, value) {
        target[property] = value;
        // Only save when actual array elements are modified, not length etc.
        if (!isNaN(parseInt(property))) {
            saveUsers();
        }
        return true;
    },
    deleteProperty(target, property) {
        delete target[property];
        saveUsers();
        return true;
    }
});

// Add methods to the proxy for array operations that modify the array
['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(method => {
    usersProxy[method] = function(...args) {
        const result = Array.prototype[method].apply(users, args);
        saveUsers();
        return result;
    };
});

// Export the users proxy
module.exports = usersProxy;
