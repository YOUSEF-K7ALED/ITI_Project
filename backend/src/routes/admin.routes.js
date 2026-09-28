const express = require("express");

const { protect } = require("../middleware/auth.middleware");
const { isAdmin } = require("../middleware/admin.middleware");
const {
  getDashboardStats,
  getAllUsers,
  blockUser,
  deleteUser,
  getAllBookings,
} = require("../controllers/admin.controller");

const router = express.Router();

// All /api/admin endpoints are private and admin-only.
// Keep the middleware order: protect -> isAdmin -> controller.
router.use(protect, isAdmin);

router.get("/stats", getDashboardStats);

router.get("/users", getAllUsers);
router.put("/users/:id/block", blockUser);
router.delete("/users/:id", deleteUser);

router.get("/bookings", getAllBookings);

module.exports = router;
