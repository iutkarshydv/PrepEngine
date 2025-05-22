module.exports = {
    // JWT Secret for signing tokens
    jwtSecret: 'prepengine-secret-key-2025',
    
    // JWT expiration time (in seconds or as a string, e.g., '1h')
    jwtExpiration: '24h',
    
    // Server port
    port: process.env.PORT || 3000,
    
    // Environment
    env: process.env.NODE_ENV || 'development'
};
