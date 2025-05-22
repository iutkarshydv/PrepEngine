const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const config = require('./config');
const fs = require('fs');
const fsPromises = require('fs').promises;

// Initialize Express app
const app = express();

// Middleware
app.use(express.json({ extended: false }));
app.use(morgan('dev'));

// CORS configuration
app.use(cors({
  origin: '*', // Allow all origins in development
  credentials: true
}));

// Define routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/saved', require('./routes/saved'));
app.use('/api/admin', require('./routes/admin'));

// API to get all courses from database
app.get('/api/courses', async (req, res) => {
  try {
    console.log('API Request: GET /api/courses');
    
    // Try to read from the database folder in the root directory
    try {
      // Read all directories in the database folder
      const courseDirs = await fsPromises.readdir(path.join(__dirname, '..', 'database'), { withFileTypes: true });
      
      console.log('Database directory contents:', courseDirs.map(d => d.name));
      
      // Filter out only directories
      const courses = courseDirs
        .filter(dirent => dirent.isDirectory())
        .map(dirent => ({
          _id: Date.now() + Math.floor(Math.random() * 1000).toString(),
          name: dirent.name,
          path: `database/${dirent.name}`
        }));
        
      console.log('Filtered course directories:', courses.map(c => c.name));
        
      // Generate descriptions and image keywords based on course names
      const coursesWithDetails = courses.map(course => {
        let description = `Course materials and resources for ${course.name}`;
        let imageKeyword = 'education';
        
        // Set custom descriptions and image keywords based on course name
        if (course.name.toLowerCase().includes('python')) {
          description = 'Learn Python fundamentals, modules, data structures, and applications';
          imageKeyword = 'python';
        } else if (course.name.toLowerCase().includes('data structure') || course.name.toLowerCase().includes('algorithm')) {
          description = 'Fundamental algorithms, data structures, and problem-solving';
          imageKeyword = 'algorithm';
        } else if (course.name.toLowerCase().includes('operating')) {
          description = 'Process management, memory management, and OS architecture';
          imageKeyword = 'computer';
        } else if (course.name.toLowerCase().includes('circuit') || course.name.toLowerCase().includes('electric')) {
          description = 'Circuit analysis, electrical components, and system design';
          imageKeyword = 'circuit';
        } else if (course.name.toLowerCase().includes('design') || course.name.toLowerCase().includes('modelling')) {
          description = 'CAD/CAM, design principles, and 3D modelling techniques';
          imageKeyword = 'engineering';
        } else if (course.name.toLowerCase().includes('drone')) {
          description = 'Drone technology, applications, and control systems';
          imageKeyword = 'drone';
        } else if (course.name.toLowerCase().includes('communication')) {
          description = 'Technical writing, presentation skills, and professional etiquette';
          imageKeyword = 'communication';
        }
        
        return {
          ...course,
          description,
          imageKeyword
        };
      });
      
      // If courses found, return them
      if (coursesWithDetails.length > 0) {
        console.log(`Sending ${coursesWithDetails.length} courses to client`);
        return res.json(coursesWithDetails);
      }
    } catch (err) {
      console.log('Error reading database directory:', err.message);
      // Continue to fallback demo courses
    }
    
    // Fallback to demo courses if no courses found or error occurred
    console.log('No courses found in database, returning demo courses');
    const demoCourses = [
      {
        _id: '1',
        name: 'Python Programming',
        description: 'Learn Python fundamentals, modules, data structures, and applications',
        imageKeyword: 'python'
      },
      {
        _id: '2',
        name: 'Data Structures And Algorithm',
        description: 'Fundamental algorithms, data structures, and problem-solving',
        imageKeyword: 'algorithm'
      },
      {
        _id: '3',
        name: 'Operating Systems',
        description: 'Process management, memory management, and OS architecture',
        imageKeyword: 'computer'
      }
    ];
    
    res.json(demoCourses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    
    // Send demo courses on error to ensure UI works
    const demoCourses = [
      {
        _id: '1',
        name: 'Python Programming (Demo)',
        description: 'Learn Python fundamentals, modules, data structures, and applications',
        imageKeyword: 'python'
      },
      {
        _id: '2',
        name: 'Data Structures (Demo)',
        description: 'Fundamental algorithms, data structures, and problem-solving',
        imageKeyword: 'algorithm'
      }
    ];
    
    console.log('Sending demo courses due to error');
    res.json(demoCourses);
  }
});

app.get('/api/course/:courseName', async (req, res) => {
  try {
    const { courseName } = req.params;
    const coursePath = path.join(__dirname, '..', 'database', courseName);
    
    // Check if course directory exists
    if (!fs.existsSync(coursePath)) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    try {
      // Get all files in the course directory
      const files = await getAllFiles(coursePath);
      
      // Organize files by type
      const organized = {
        notes: [],
        syllabus: [],
        questionPapers: []
      };
      
      // Process each file to categorize it correctly
      for (const file of files) {
        // Convert path to relative format for frontend
        const relativePath = file.replace(path.join(__dirname, '..'), '').replace(/\\/g, '/');
        const fileName = path.basename(file);
        const extension = path.extname(file).toLowerCase();
        
        // Use path segments to determine file type more accurately
        const pathSegments = relativePath.split('/');
        const folderName = pathSegments.length > 1 ? pathSegments[pathSegments.length - 2].toLowerCase() : '';
        
        if (folderName === 'syllabus') {
          organized.syllabus.push({
            name: fileName,
            path: relativePath,
            type: extension.substring(1) // Remove the dot
          });
        } else if (folderName === 'question-paper' || folderName === 'questionpaper' || 
                 folderName === 'question_paper' || folderName === 'questions' || 
                 folderName === 'papers' || folderName === 'exams') {
          organized.questionPapers.push({
            name: fileName,
            path: relativePath,
            type: extension.substring(1)
          });
          console.log(`Added question paper: ${fileName} from ${folderName} folder`);
        } else {
          organized.notes.push({
            name: fileName,
            path: relativePath,
            type: extension.substring(1)
          });
        }
      }
      
      res.json(organized);
    } catch (error) {
      console.error('Error fetching course files:', error);
      res.status(500).json({ message: 'Server error' });
    }
  } catch (error) {
    console.error('Error fetching course files:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Recursive function to get all files in a directory and its subdirectories
async function getAllFiles(dirPath, arrayOfFiles = []) {
  try {
    const files = await fsPromises.readdir(dirPath, { withFileTypes: true });
    
    for (const file of files) {
      const fullPath = path.join(dirPath, file.name);
      
      if (file.isDirectory()) {
        // Recursive call for directories
        await getAllFiles(fullPath, arrayOfFiles);
      } else {
        // Add file path to the array
        arrayOfFiles.push(fullPath);
      }
    }
    
    return arrayOfFiles;
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
    return arrayOfFiles;
  }
}

// Serve static files from the database directory and root directory
// IMPORTANT: These must come AFTER the API routes to avoid intercepting API requests
app.use('/database', express.static(path.join(__dirname, '../database')));
app.use(express.static(path.join(__dirname, '..')));

// The catch-all route should be the very last route
// For development, serve the index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'index.html'));
});

// Helper function to get image keyword for course
function getImageKeyword(courseName) {
  const keywords = {
    'python': 'python',
    'data': 'algorithm',
    'algorithm': 'algorithm',
    'computer': 'computer',
    'circuit': 'circuit',
    'engineering': 'engineering',
    'drone': 'drone',
    'communication': 'communication',
    'technical': 'technical'
  };
  
  for (const [key, value] of Object.entries(keywords)) {
    if (courseName.includes(key)) {
      return value;
    }
  }
  
  return 'education';
}

// For development, we'll start the server without requiring MongoDB connection
// This allows basic testing of the API endpoints without a database

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Running in development mode without MongoDB connection');
  console.log('API endpoints available at:');
  console.log(`- Authentication: http://localhost:${PORT}/api/auth`);
  console.log(`- Saved Content: http://localhost:${PORT}/api/saved`);
  console.log(`- Courses: http://localhost:${PORT}/api/courses`);
});

/* MongoDB connection code - Uncomment when database is available
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB Connected');
})
.catch(err => {
  console.error('MongoDB connection error:', err.message);
  // Don't exit process in development mode
  console.log('Running in fallback mode without database connection');
});
*/