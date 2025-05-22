const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// For development, we'll use in-memory storage for saved content
// This is just for development and testing purposes
const users = require('../data/users');

// Uncomment when MongoDB is available
// const User = require('../models/User');

/**
 * @route   GET /api/saved
 * @desc    Get all saved content for a user
 * @access  Private
 */
router.get('/', auth, (req, res) => {
  try {
    // Get user ID from the authenticated request
    const userId = req.user.id;
    
    // Find the user in the users array
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return the user's saved content
    const savedContent = {
      savedCourses: user.savedCourses || [],
      savedNotes: user.savedNotes || [],
      savedSyllabus: user.savedSyllabus || [],
      savedPapers: user.savedPapers || []
    };
    
    res.json(savedContent);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @route   GET /api/saved/courses
 * @desc    Get all saved courses for a user
 * @access  Private
 */
router.get('/courses', auth, (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find the user in the users array
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.savedCourses || []);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @route   POST /api/saved/course
 * @desc    Save a course
 * @access  Private
 */
router.post('/course', auth, (req, res) => {
  const { courseName, courseId } = req.body;
  
  if (!courseName) {
    return res.status(400).json({ message: 'Course name is required' });
  }
  
  try {
    const userId = req.user.id;
    
    // Find the user in the users array
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Initialize savedCourses array if it doesn't exist
    if (!user.savedCourses) {
      user.savedCourses = [];
    }
    
    // Check if course is already saved
    const existingCourse = user.savedCourses.find(
      course => course.courseName === courseName || course.courseId === courseId
    );
    
    if (existingCourse) {
      return res.status(400).json({ message: 'Course already saved' });
    }
    
    // Create course object with ID
    const courseObj = {
      _id: Date.now().toString(), // Generate a simple ID for development
      courseId: courseId || Date.now().toString(),
      courseName,
      dateAdded: new Date().toISOString()
    };
    
    // Add course to saved courses
    user.savedCourses.push(courseObj);
    
    console.log(`User ${userId} saved course: ${courseName}`);
    res.json(user.savedCourses);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   DELETE /api/saved/course/:id
 * @desc    Remove a saved course
 * @access  Private
 */
router.delete('/course/:id', auth, (req, res) => {
  try {
    const userId = req.user.id;
    const courseId = req.params.id;
    
    // Find the user in the users array
    const user = users.find(u => u.id === userId);
    
    if (!user || !user.savedCourses) {
      return res.status(404).json({ message: 'No saved content found' });
    }
    
    // Find course index
    const courseIndex = user.savedCourses.findIndex(
      course => course._id === courseId || course.courseId === courseId
    );
    
    // Check if course exists
    if (courseIndex === -1) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Remove course from saved courses
    user.savedCourses.splice(courseIndex, 1);
    
    console.log(`User ${userId} removed course with ID: ${courseId}`);
    res.json(user.savedCourses);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/saved/notes
 * @desc    Get all saved notes for a user
 * @access  Private
 */
router.get('/notes', auth, (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find the user in the users array
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.savedNotes || []);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST /api/saved/note
 * @desc    Save a note
 * @access  Private
 */
router.post('/note', auth, (req, res) => {
  const { title, courseName, url } = req.body;
  
  if (!title || !courseName) {
    return res.status(400).json({ message: 'Title and course name are required' });
  }
  
  try {
    const userId = req.user.id;
    
    // Find the user in the users array
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Initialize arrays if they don't exist
    if (!user.savedNotes) user.savedNotes = [];
    if (!user.savedCourses) user.savedCourses = [];
    
    // Create note object with ID
    const noteObj = {
      _id: Date.now().toString(),
      title,
      courseName,
      url: url || `#`,
      dateAdded: new Date().toISOString()
    };
    
    // Check if note is already saved
    const noteExists = user.savedNotes.some(
      note => note.title === title && note.courseName === courseName
    );
    
    if (noteExists) {
      return res.status(400).json({ message: 'Note already saved' });
    }
    
    // Add note to saved notes
    user.savedNotes.push(noteObj);
    
    // Auto-save the course if not already saved
    const courseExists = user.savedCourses.some(
      course => course.courseName === courseName
    );
    
    if (!courseExists) {
      const courseObj = {
        _id: `course_${Date.now().toString()}`,
        courseName,
        dateAdded: new Date().toISOString()
      };
      user.savedCourses.push(courseObj);
    }
    
    console.log(`User ${userId} saved note: ${title} for course: ${courseName}`);
    res.json(user.savedNotes);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   DELETE /api/saved/note/:id
 * @desc    Remove a saved note
 * @access  Private
 */
router.delete('/note/:id', auth, (req, res) => {
  try {
    const userId = req.user.id;
    const noteId = req.params.id;
    
    // Find the user in the users array
    const user = users.find(u => u.id === userId);
    
    if (!user || !user.savedNotes) {
      return res.status(404).json({ message: 'No saved content found' });
    }
    
    // Find note index
    const noteIndex = user.savedNotes.findIndex(
      note => note._id === noteId
    );
    
    // Check if note exists
    if (noteIndex === -1) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    // Remove note from saved notes
    user.savedNotes.splice(noteIndex, 1);
    
    console.log(`User ${userId} removed note with ID: ${noteId}`);
    res.json(user.savedNotes);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/saved/syllabus
 * @desc    Get all saved syllabus for a user
 * @access  Private
 */
router.get('/syllabus', auth, (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find the user in the users array
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.savedSyllabus || []);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST /api/saved/syllabus
 * @desc    Save a syllabus
 * @access  Private
 */
router.post('/syllabus', auth, (req, res) => {
  const { title, courseName, url } = req.body;
  
  if (!title || !courseName) {
    return res.status(400).json({ message: 'Title and course name are required' });
  }
  
  try {
    const userId = req.user.id;
    
    // Find the user in the users array
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Initialize arrays if they don't exist
    if (!user.savedSyllabus) user.savedSyllabus = [];
    if (!user.savedCourses) user.savedCourses = [];
    
    // Create syllabus object with ID
    const syllabusObj = {
      _id: Date.now().toString(),
      title,
      courseName,
      url: url || `#`,
      dateAdded: new Date().toISOString()
    };
    
    // Check if syllabus is already saved
    const syllabusExists = user.savedSyllabus.some(
      syllabus => syllabus.title === title && syllabus.courseName === courseName
    );
    
    if (syllabusExists) {
      return res.status(400).json({ message: 'Syllabus already saved' });
    }
    
    // Add syllabus to saved syllabus
    user.savedSyllabus.push(syllabusObj);
    
    // Auto-save the course if not already saved
    const courseExists = user.savedCourses.some(
      course => course.courseName === courseName
    );
    
    if (!courseExists) {
      const courseObj = {
        _id: `course_${Date.now().toString()}`,
        courseName,
        dateAdded: new Date().toISOString()
      };
      user.savedCourses.push(courseObj);
    }
    
    console.log(`User ${userId} saved syllabus: ${title} for course: ${courseName}`);
    res.json(user.savedSyllabus);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   DELETE /api/saved/syllabus/:id
 * @desc    Remove a saved syllabus
 * @access  Private
 */
router.delete('/syllabus/:id', auth, (req, res) => {
  try {
    const userId = req.user.id;
    const syllabusId = req.params.id;
    
    // Find the user in the users array
    const user = users.find(u => u.id === userId);
    
    if (!user || !user.savedSyllabus) {
      return res.status(404).json({ message: 'No saved content found' });
    }
    
    // Find syllabus index
    const syllabusIndex = user.savedSyllabus.findIndex(
      syllabus => syllabus._id === syllabusId
    );
    
    // Check if syllabus exists
    if (syllabusIndex === -1) {
      return res.status(404).json({ message: 'Syllabus not found' });
    }
    
    // Remove syllabus from saved syllabus
    user.savedSyllabus.splice(syllabusIndex, 1);
    
    console.log(`User ${userId} removed syllabus with ID: ${syllabusId}`);
    res.json(user.savedSyllabus);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/saved/papers
 * @desc    Get all saved papers for a user
 * @access  Private
 */
router.get('/papers', auth, (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find the user in the users array
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.savedPapers || []);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST /api/saved/paper
 * @desc    Save a paper
 * @access  Private
 */
router.post('/paper', auth, (req, res) => {
  const { title, courseName, url } = req.body;
  
  if (!title || !courseName) {
    return res.status(400).json({ message: 'Title and course name are required' });
  }
  
  try {
    const userId = req.user.id;
    
    // Find the user in the users array
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Initialize arrays if they don't exist
    if (!user.savedPapers) user.savedPapers = [];
    if (!user.savedCourses) user.savedCourses = [];
    
    // Create paper object with ID
    const paperObj = {
      _id: Date.now().toString(),
      title,
      courseName,
      url: url || `#`,
      dateAdded: new Date().toISOString()
    };
    
    // Check if paper is already saved
    const paperExists = user.savedPapers.some(
      paper => paper.title === title && paper.courseName === courseName
    );
    
    if (paperExists) {
      return res.status(400).json({ message: 'Paper already saved' });
    }
    
    // Add paper to saved papers
    user.savedPapers.push(paperObj);
    
    // Auto-save the course if not already saved
    const courseExists = user.savedCourses.some(
      course => course.courseName === courseName
    );
    
    if (!courseExists) {
      const courseObj = {
        _id: `course_${Date.now().toString()}`,
        courseName,
        dateAdded: new Date().toISOString()
      };
      user.savedCourses.push(courseObj);
    }
    
    console.log(`User ${userId} saved paper: ${title} for course: ${courseName}`);
    res.json(user.savedPapers);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   DELETE /api/saved/paper/:id
 * @desc    Remove a saved paper
 * @access  Private
 */
router.delete('/paper/:id', auth, (req, res) => {
  try {
    const userId = req.user.id;
    const paperId = req.params.id;
    
    // Find the user in the users array
    const user = users.find(u => u.id === userId);
    
    if (!user || !user.savedPapers) {
      return res.status(404).json({ message: 'No saved content found' });
    }
    
    // Find paper index
    const paperIndex = user.savedPapers.findIndex(
      paper => paper._id === paperId
    );
    
    // Check if paper exists
    if (paperIndex === -1) {
      return res.status(404).json({ message: 'Paper not found' });
    }
    
    // Remove paper from saved papers
    user.savedPapers.splice(paperIndex, 1);
    
    console.log(`User ${userId} removed paper with ID: ${paperId}`);
    res.json(user.savedPapers);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST /api/saved/paper
 * @desc    Save a question paper
 * @access  Private
 */
router.post('/paper', auth, async (req, res) => {
  const { id, title, course, url } = req.body;
  
  try {
    const user = await User.findById(req.user.id);
    
    // Check if paper is already saved
    const paperExists = user.savedPapers.some(paper => paper.id === id);
    if (paperExists) {
      return res.status(400).json({ message: 'Question paper already saved' });
    }
    
    // Add paper to saved papers
    user.savedPapers.push({ id, title, course, url });
    
    // Auto-save the course if not already saved
    if (!user.savedCourses.includes(course)) {
      user.savedCourses.push(course);
    }
    
    await user.save();
    
    res.json(user.savedPapers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @route   DELETE /api/saved/paper/:id
 * @desc    Remove a saved question paper
 * @access  Private
 */
router.delete('/paper/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Find the paper to remove
    const paperToRemove = user.savedPapers.find(paper => paper.id === req.params.id);
    if (!paperToRemove) {
      return res.status(404).json({ message: 'Question paper not found' });
    }
    
    // Filter out the paper to remove
    user.savedPapers = user.savedPapers.filter(paper => paper.id !== req.params.id);
    
    // Check if there are any other saved items for this course
    const courseName = paperToRemove.course;
    const hasOtherSavedNotes = user.savedNotes.some(note => note.course === courseName);
    const hasOtherSavedSyllabus = user.savedSyllabus.some(syllabus => syllabus.course === courseName);
    const hasOtherSavedPapers = user.savedPapers.some(paper => paper.course === courseName);
    
    // Remove the course if there are no other saved items
    if (!hasOtherSavedNotes && !hasOtherSavedSyllabus && !hasOtherSavedPapers) {
      user.savedCourses = user.savedCourses.filter(course => course !== courseName);
    }
    
    await user.save();
    
    res.json(user.savedPapers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
