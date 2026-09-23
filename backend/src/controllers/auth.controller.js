// Controller: Authentication (Person 1)
//
// register(req, res, next)
//   - Get { name, email, password } from req.body
//   - Check if email already exists -> 400 "Email already registered"
//   - Create new User (password gets hashed via model pre-save hook)
//   - Generate JWT (utils/generateToken.js)
//   - Respond with user info (no password) + token
//
// login(req, res, next)
//   - Get { email, password } from req.body
//   - Find user by email
//   - If not found -> 401 "Invalid credentials"
//   - Compare password using user.comparePassword()
//   - If invalid -> 401 "Invalid credentials"
//   - Generate JWT and respond with user info + token
//
// (Optional) logout(req, res)
//   - If using cookies: clear the auth cookie
