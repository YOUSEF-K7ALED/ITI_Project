// Controller: Events (Person 2)
//
// getEvents(req, res, next)
//   - Support query params: search (title), category, location, price (max), date
//   - Support pagination: page, limit
//   - Build a Mongoose filter object from query params
//   - Return list of events + pagination info (total, page, pages)
//
// getEventById(req, res, next)
//   - Find event by req.params.id
//   - If not found -> 404
//   - Return event details (include availableSeats)
//
// createEvent(req, res, next)      [admin only, also used by Person 4]
//   - Create a new event from req.body
//   - Attach createdBy = req.user._id
//
// updateEvent(req, res, next)      [admin only]
//   - Find event by id, update fields, save
//
// deleteEvent(req, res, next)      [admin only]
//   - Find event by id and remove it
