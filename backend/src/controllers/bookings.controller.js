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
