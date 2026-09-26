// Controller: Bookings (Person 3)
//
// createBooking(req, res, next)
//   - Get eventId from req.body, userId from req.user._id
//   - Find the event; if not found -> 404
//   - Check for existing booking (same user + event, status "confirmed")
//       -> if exists: 400 "You already booked this event"
//   - Check availableSeats (capacity - bookedSeats)
//       -> if 0: 400 "No available seats"
//   - Create Booking with status "confirmed"
//   - Increment event.bookedSeats and save
//   - Respond with the created booking
//
// getMyBookings(req, res, next)
//   - Find all bookings where user = req.user._id
//   - Populate event details
//   - Return list
//
// cancelBooking(req, res, next)
//   - Find booking by req.params.id, ensure it belongs to req.user
//   - Set status = "cancelled"
//   - Decrement event.bookedSeats (don't go below 0)
//   - Save both documents
const Booking = require("../models/Booking.js");
const Event = require("../models/Event.js");
const createBooking = async function (req, res) {
  try {
    const { eventId } = req.body;

    //check if the event exist or not
    const existevent = await Event.findById(eventId);

    if (!existevent) {
      return res.json({
        message: "Event not found",
      });
    }

    // Check if the user has already booked this event if it founded it means he already booked this event
    const existingBooking = await Booking.findOne({
      user: req.user.id,
      event: eventId,
    });

    if (existingBooking) {
      return res.json({ message: "You already booked this event" });
    }

    //check if there is capacity avilable or not
    if (existevent.availableSeats <= 0) {
      return res.json({ message: "No available seats" });
    }

    //create booking
    const booking = await Booking.create({
      user: req.user.id,
      event: eventId,
      status: "confirmed",
    });

    existevent.bookedSeats += 1;
    await existevent.save();

    return res.json({ message: "Booking created successfully", booking });
  } catch (err) {
    return res.json({ message: err.message });
  }
};

const getMyBookings = async function (req, res) {
  try {
    const allBookings = await Booking.find({ user: req.user.id }).populate(
      "event",
    );

    return res.json(allBookings);
  } catch (err) {
    return res.json({
      message: err.message,
    });
  }
};

const cancelBooking = async function (req, res) {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }
    if (booking.status === "cancelled") {
      return res.status(400).json({
        message: "Booking is already cancelled",
      });
    }

    const event = await Event.findById(booking.event);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }
    booking.status = "cancelled";
    event.bookedSeats -= 1;
    await booking.save();
    await event.save();
    return res.status(200).json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
};
