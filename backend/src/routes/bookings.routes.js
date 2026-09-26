// Routes: /api/bookings   (Person 3 - Bookings)
// All routes require "protect" middleware (must be logged in)
// - POST   /            -> bookings.controller.createBooking
// - GET    /my          -> bookings.controller.getMyBookings
// - PUT    /:id/cancel  -> bookings.controller.cancelBooking
const express = require("express");

const {
  createBooking,
  getMyBookings,
  cancelBooking,
} = require("../controllers/bookingController.js");

const { protect } = require("../middleware/auth.middleware.js");

const router = express.Router();

router.post("/", protect, createBooking);

router.get("/my-bookings", protect, getMyBookings);

router.patch("/:id/cancel", protect, cancelBooking);

module.exports = router;
