module.exports = {
  // MongoDB connection string
  // Replace this with your actual MongoDB Atlas connection string when deploying
  mongoURI: process.env.MONGO_URI || "mongodb://localhost:27017/notenexus",
  
  // JWT secret for authentication
  // In production, use a strong, unique secret
  jwtSecret: process.env.JWT_SECRET || "notenexus_jwt_secret_key",
  
  // JWT token expiration (in seconds)
  jwtExpiration: 86400, // 24 hours
  
  // Server port
  port: process.env.PORT || 3000,
  
  // CORS origins
  allowedOrigins: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:3000', 'http://localhost:5000']
};
