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


const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: "Email already registered" });

    const user = await User.create({ name, email, password });
    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};