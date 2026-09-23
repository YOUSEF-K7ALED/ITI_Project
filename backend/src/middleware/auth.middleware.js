// "protect" middleware (Person 1 - Authentication)
// - Read the JWT from the Authorization header ("Bearer <token>")
// - If missing -> 401 Unauthorized
// - Verify token using JWT_SECRET
// - Find the user by the decoded id, attach to req.user (exclude password)
// - If invalid/expired -> 401 Unauthorized
// - Call next()
