// Helper function: generateToken(userId)
// - Import jsonwebtoken
// - Sign a JWT with payload { id: userId }
// - Use process.env.JWT_SECRET and process.env.JWT_EXPIRES_IN
// - Return the signed token
// - Used by auth.controller.js after successful register/login
