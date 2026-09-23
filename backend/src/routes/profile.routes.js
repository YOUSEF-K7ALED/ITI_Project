// Routes: /api/profile   (Person 5 - Profile)
// All routes require "protect" middleware
// - GET  /                  -> profile.controller.getProfile
// - PUT  /                  -> profile.controller.updateProfile
// - PUT  /change-password   -> profile.controller.changePassword

const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const {
  getProfile,
  updateProfile,
  changePassword,
  deleteProfile,
} = require("../controllers/profile.controller");

router.get("/", protect, getProfile);          // READ
router.put("/", protect, updateProfile);       // UPDATE (info)
router.put("/change-password", protect, changePassword); // UPDATE (password)
router.delete("/", protect, deleteProfile);    // DELETE

module.exports = router;