// "protect" middleware (Person 1 - Authentication)
// - Read the JWT from the Authorization header ("Bearer <token>")
// - If missing -> 401 Unauthorized
// - Verify token using JWT_SECRET
// - Find the user by the decoded id, attach to req.user (exclude password)
// - If invalid/expired -> 401 Unauthorized
// - Call next()


const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id); // password excluded by default (select: false)
    if (!user) {
      return res.status(401).json({ success: false, message: "User no longer exists" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Not authorized, token failed" });
  }
};