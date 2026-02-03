# PrepEngine

![PrepEngine Banner](https://img.shields.io/badge/PrepEngine-Engineering%20Exam%20Preparation-blue?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)

> A comprehensive web-based platform designed to help Computer Science and Engineering students prepare for exams by providing organized access to course materials, notes, question papers, and syllabus documents.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Available Courses](#available-courses)
- [API Endpoints](#api-endpoints)
- [Admin Panel](#admin-panel)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

PrepEngine is a full-stack web application that centralizes engineering course materials, making it easier for students to access and manage their study resources. The platform features user authentication, content saving capabilities, and an administrative interface for managing users and content.

## ✨ Features

### For Students
- 📚 **Course Browser**: Browse through various engineering courses with rich descriptions and images
- 📝 **Organized Materials**: Access notes, question papers, and syllabus for each course
- 💾 **Save Content**: Bookmark and save courses, notes, papers, and syllabus for quick access
- 🔐 **User Authentication**: Secure signup and login system with JWT tokens
- 📱 **Responsive Design**: Mobile-friendly interface that works on all devices
- 🔍 **Easy Navigation**: Intuitive UI with hamburger menu and organized sections

### For Administrators
- 👥 **User Management**: View, edit, and delete user accounts
- ⚙️ **Settings Control**: Configure session timeouts, registration permissions, and content saving options
- 📊 **Dashboard**: Monitor platform statistics and user activities
- 🔒 **Secure Access**: Protected admin panel with separate authentication

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with gradients and animations
- **JavaScript (ES6+)** - Client-side logic
- **Font Awesome** - Icons
- **Google Fonts** - Typography

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB/Mongoose** - Database (with in-memory fallback)
- **JWT** - Authentication tokens
- **bcrypt.js** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger
- **Multer** - File upload handling

## 📁 Project Structure

```
PrepEngine/
├── index.html              # Landing page
├── course-list.html        # Course listing page
├── course.html             # Individual course page
├── login.html              # User login
├── signup.html             # User registration
├── admin-login.html        # Admin login
├── admin-panel.html        # Admin dashboard
├── saved-content.html      # User's saved items
├── savednotes.html         # Saved notes viewer
├── question-paper.html     # Question paper viewer
├── syllabus.html           # Syllabus viewer
├── css/
│   ├── style.css           # Main stylesheet
│   └── header.css          # Header component styles
├── js/
│   ├── api.js              # API client functions
│   └── header-init.js      # Header initialization
├── includes/
│   └── header.html         # Reusable header component
├── database/               # Course materials organized by subject
│   ├── Python Programming/
│   ├── Data Structures And Algorithm/
│   ├── Operating System/
│   ├── Electric Circuit And Systems/
│   ├── Engineering Design Modelling/
│   ├── Introduction to Drones/
│   ├── Professional Communication/
│   ├── Effective Technical Communication/
│   └── Applied Numerical Methods/
├── server/                 # Backend application
│   ├── server.js           # Main server file
│   ├── config.js           # Configuration settings
│   ├── package.json        # Server dependencies
│   ├── routes/
│   │   ├── auth.js         # Authentication routes
│   │   ├── saved.js        # Saved content routes
│   │   └── admin.js        # Admin routes
│   ├── middleware/
│   │   └── auth.js         # JWT authentication middleware
│   ├── models/
│   │   └── User.js         # User model schema
│   ├── data/
│   │   ├── users.js        # In-memory user storage
│   │   ├── admin-settings.json
│   │   └── db.json         # Database configuration
│   └── config/
│       └── default.js      # Default configuration
├── package.json            # Root dependencies
└── render.yaml             # Render deployment config
```

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (optional, has in-memory fallback)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/iutkarshydv/PrepEngine.git
   cd PrepEngine
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

4. **Configure environment variables** (optional)
   Create a `.env` file in the `server` directory:
   ```env
   PORT=3000
   JWT_SECRET=your-secret-key
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/prepengine
   ```

5. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Open the application**
   Navigate to `http://localhost:3000` in your browser

## 📖 Usage

### For Students

1. **Sign Up**: Create a new account from the homepage
2. **Browse Courses**: View available courses with descriptions and images
3. **Access Materials**: Click on any course to view notes, question papers, and syllabus
4. **Save Content**: Click the save button to bookmark materials for later
5. **View Saved Items**: Access your saved content from the user menu

### For Administrators

1. **Login**: Navigate to `/admin-login.html`
2. **Default Credentials**:
   - Username: `admin`
   - Password: (configured in admin settings)
3. **Manage Users**: View, edit, or delete user accounts
4. **Configure Settings**: Adjust session timeouts and feature permissions

## 📚 Available Courses

The platform currently includes materials for:

1. **Python Programming** - Fundamentals, modules, data structures, and applications
2. **Data Structures And Algorithm** - Core algorithms and data structures
3. **Operating System** - Process management, memory management, OS architecture
4. **Electric Circuit And Systems** - Circuit analysis and electrical components
5. **Engineering Design Modelling** - CAD/CAM and 3D modeling techniques
6. **Introduction to Drones** - Drone technology and control systems
7. **Professional Communication** - Technical writing and presentation skills
8. **Effective Technical Communication** - Advanced communication strategies
9. **Applied Numerical Methods** - Numerical analysis and computational methods

Each course includes:
- 📄 Notes organized by modules
- 📋 Previous year question papers
- 📖 Complete syllabus documents

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/user` - Get current user data

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/course/:courseName` - Get specific course details
- `GET /api/course/:courseName/:type/:filename` - Get course file

### Saved Content
- `GET /api/saved` - Get all saved content
- `GET /api/saved/courses` - Get saved courses
- `POST /api/saved/course` - Save a course
- `DELETE /api/saved/course/:courseName` - Remove saved course
- `POST /api/saved/note` - Save a note
- `DELETE /api/saved/note/:noteId` - Remove saved note
- `GET /api/saved/syllabus` - Get saved syllabus
- `GET /api/saved/papers` - Get saved papers

### Admin (Protected)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/user/:userId` - Update user
- `DELETE /api/admin/user/:userId` - Delete user
- `GET /api/admin/settings` - Get admin settings
- `PUT /api/admin/settings` - Update admin settings

## 👨‍💼 Admin Panel

The admin panel provides comprehensive control over the platform:

### Features
- **User Management**
  - View all registered users
  - Edit user details
  - Delete user accounts
  - Reset user passwords

- **Settings Management**
  - Configure session timeout
  - Enable/disable user registration
  - Enable/disable content saving
  - Update admin credentials

- **Statistics Dashboard**
  - Total users count
  - Active sessions
  - Content access analytics

## ⚙️ Configuration

### Server Configuration (`server/config.js`)
```javascript
{
  jwtSecret: 'prepengine-secret-key-2025',
  jwtExpiration: '24h',
  port: 3000,
  env: 'development'
}
```

### Admin Settings (`server/data/admin-settings.json`)
```json
{
  "username": "admin",
  "sessionTimeout": 60,
  "allowRegistration": true,
  "allowContentSaving": true
}
```

### API Base URL (`js/api.js`)
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

## 🌐 Deployment

### Render Deployment

The project includes a `render.yaml` configuration for easy deployment:

```yaml
services:
  - type: web
    name: prepengine
    env: node
    buildCommand: npm install
    startCommand: node server.js
    envVars:
      - key: NODE_ENV
        value: production
```

### Vercel Deployment

This project is configured for easy deployment on Vercel:

1. **Install Vercel CLI** (optional):
   ```bash
   npm install -g vercel
   ```

2. **Deploy via Vercel CLI**:
   ```bash
   cd d:\GitHub\PrepEngine
   vercel
   ```
   Follow the prompts to link your project and deploy.

3. **Deploy via Vercel Dashboard**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will automatically detect the `vercel.json` configuration
   - Click "Deploy"

4. **Environment Variables** (if needed):
   - In Vercel Dashboard, go to Project Settings → Environment Variables
   - Add any required variables (MONGODB_URI, JWT_SECRET, etc.)

The project includes a `vercel.json` configuration file that:
- Builds the Express server as a serverless function
- Routes API requests to `/api/*` endpoints
- Serves static frontend files from the root directory

### Manual Deployment

1. Set up a Node.js hosting environment
2. Install dependencies: `npm install`
3. Set environment variables
4. Start the server: `npm start`
5. Configure domain and SSL certificate

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Utkarsh Yadav** ([@iutkarshydv](https://github.com/iutkarshydv))

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- Express.js community for excellent documentation
- All contributors and users of PrepEngine

---

**Note**: This project uses in-memory storage for development. For production use, configure MongoDB connection in `server/config.js`.

For issues, questions, or suggestions, please open an issue on GitHub.
#   T r i g g e r   r e d e p l o y  
 