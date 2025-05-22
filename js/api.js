/**
 * API Service for NoteNexus
 * Handles all communication with the backend server
 */

// Base API URL - change this when deploying
const API_BASE_URL = 'http://localhost:3000/api';

// Helper function to get auth token from localStorage
const getToken = () => localStorage.getItem('token');

// Helper function to handle API errors
const handleError = (error) => {
  console.error('API Error:', error);
  if (error.response && error.response.status === 401) {
    // Unauthorized - clear token and redirect to login
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    window.location.href = '/login.html';
  }
  throw error;
};

/**
 * Authentication API
 */
const AuthAPI = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      
      const data = await response.json();
      localStorage.setItem('token', data.token);
      return data;
    } catch (error) {
      handleError(error);
    }
  },
  
  // Login user
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      
      const data = await response.json();
      localStorage.setItem('token', data.token);
      return data;
    } catch (error) {
      handleError(error);
    }
  },
  
  // Get current user data
  getCurrentUser: async () => {
    try {
      const token = getToken();
      if (!token) {
        return null;
      }
      
      const response = await fetch(`${API_BASE_URL}/auth/user`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('currentUser');
          return null;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get user data');
      }
      
      const userData = await response.json();
      localStorage.setItem('currentUser', JSON.stringify(userData));
      return userData;
    } catch (error) {
      handleError(error);
    }
  },
  
  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    window.location.href = '/index.html';
  }
};

/**
 * Saved Content API
 */
const SavedAPI = {
  // Get all saved content
  getAllSaved: async () => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token');
      }
      
      console.log('API: Fetching all saved content with token:', token.substring(0, 10) + '...');
      
      const response = await fetch(`${API_BASE_URL}/saved`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('API: All saved content response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get saved content');
      }
      
      const data = await response.json();
      console.log('API: All saved content data:', data);
      return data;
    } catch (error) {
      console.error('API: Error in getAllSaved:', error);
      throw error; // Re-throw the error so it can be caught by the caller
    }
  },
  
  // Get saved courses
  getSavedCourses: async () => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token');
      }
      
      console.log('API: Fetching saved courses with token:', token.substring(0, 10) + '...');
      
      const response = await fetch(`${API_BASE_URL}/saved/courses`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('API: Saved courses response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get saved courses');
      }
      
      const data = await response.json();
      console.log('API: Saved courses data:', data);
      return data;
    } catch (error) {
      console.error('API: Error in getSavedCourses:', error);
      throw error; // Re-throw the error so it can be caught by the caller
    }
  },
  
  // Get saved notes
  getSavedNotes: async () => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token');
      }
      
      const response = await fetch(`${API_BASE_URL}/saved/notes`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get saved notes');
      }
      
      return await response.json();
    } catch (error) {
      handleError(error);
    }
  },
  
  // Get saved syllabus
  getSavedSyllabus: async () => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token');
      }
      
      const response = await fetch(`${API_BASE_URL}/saved/syllabus`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get saved syllabus');
      }
      
      return await response.json();
    } catch (error) {
      handleError(error);
    }
  },
  
  // Get saved papers
  getSavedPapers: async () => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token');
      }
      
      const response = await fetch(`${API_BASE_URL}/saved/papers`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get saved papers');
      }
      
      return await response.json();
    } catch (error) {
      handleError(error);
    }
  },
  
  // Save a course
  saveCourse: async (courseName) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token');
      }
      
      const response = await fetch(`${API_BASE_URL}/saved/course`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ courseName })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save course');
      }
      
      return await response.json();
    } catch (error) {
      handleError(error);
    }
  },
  
  // Remove a saved course
  removeCourse: async (courseName) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token');
      }
      
      const response = await fetch(`${API_BASE_URL}/saved/course/${encodeURIComponent(courseName)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove course');
      }
      
      return await response.json();
    } catch (error) {
      handleError(error);
    }
  },
  
  // Save a note
  saveNote: async (noteData) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token');
      }
      
      const response = await fetch(`${API_BASE_URL}/saved/note`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(noteData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save note');
      }
      
      return await response.json();
    } catch (error) {
      handleError(error);
    }
  },
  
  // Remove a saved note
  removeNote: async (noteId) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token');
      }
      
      const response = await fetch(`${API_BASE_URL}/saved/note/${encodeURIComponent(noteId)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove note');
      }
      
      return await response.json();
    } catch (error) {
      handleError(error);
    }
  },
  
  // Save a syllabus
  saveSyllabus: async (syllabusData) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token');
      }
      
      const response = await fetch(`${API_BASE_URL}/saved/syllabus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(syllabusData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save syllabus');
      }
      
      return await response.json();
    } catch (error) {
      handleError(error);
    }
  },
  
  // Remove a saved syllabus
  removeSyllabus: async (syllabusId) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token');
      }
      
      const response = await fetch(`${API_BASE_URL}/saved/syllabus/${encodeURIComponent(syllabusId)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove syllabus');
      }
      
      return await response.json();
    } catch (error) {
      handleError(error);
    }
  },
  
  // Save a question paper
  savePaper: async (paperData) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token');
      }
      
      const response = await fetch(`${API_BASE_URL}/saved/paper`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paperData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save question paper');
      }
      
      return await response.json();
    } catch (error) {
      handleError(error);
    }
  },
  
  // Remove a saved question paper
  removePaper: async (paperId) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token');
      }
      
      const response = await fetch(`${API_BASE_URL}/saved/paper/${encodeURIComponent(paperId)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove question paper');
      }
      
      return await response.json();
    } catch (error) {
      handleError(error);
    }
  }
};

// Export the API services
const API = {
  auth: AuthAPI,
  saved: SavedAPI
};

// Make API available globally
window.API = API;
