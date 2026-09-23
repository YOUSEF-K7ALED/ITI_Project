// Controller: Profile (Person 5)
//
// getProfile(req, res, next)
//   - Return req.user (already attached by auth middleware, no password)
//
// updateProfile(req, res, next)
//   - Get { name, email } from req.body
//   - Find req.user._id, update fields, save
//   - Return updated user
//
// changePassword(req, res, next)
//   - Get { currentPassword, newPassword } from req.body
//   - Verify currentPassword with user.comparePassword()
//   - If invalid -> 400 "Current password is incorrect"
//   - Set user.password = newPassword (hashed by pre-save hook), save
//
// (Optional) notifications endpoints if the feature is implemented later



const User = require("../models/User");

// CREATE — profile creation happens via Register (auth.controller.js),
// since a profile IS the User record. No separate "create" here.

// READ — GET /api/profile
exports.getProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (err) {
    next(err);
  }
};

// UPDATE 
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ success: false, message: "Email already in use" });
      }
      user.email = email;
    }

    if (name) user.name = name;

    await user.save();

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// UPDATE (password) 
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current and new password are required",
      });
    }

    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
};

// DELETE — DELETE /api/profile
exports.deleteProfile = async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required to delete your account",
      });
    }

    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Incorrect password" });
    }

    await User.findByIdAndDelete(req.user._id);

    // NOTE: consider also deleting/cancelling this user's bookings here,
    // or leaving them for historical/admin records depending on your design

    res.status(200).json({ success: true, message: "Account deleted successfully" });
  } catch (err) {
    next(err);
  }
};