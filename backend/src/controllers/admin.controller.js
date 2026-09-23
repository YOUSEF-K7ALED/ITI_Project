// Controller: Admin (Person 4)
//
// getDashboardStats(req, res, next)
//   - Count total users, total events, total bookings
//   - Return { usersCount, eventsCount, bookingsCount }
//
// getAllUsers(req, res, next)
//   - Return list of all users (exclude password)
//
// blockUser(req, res, next)
//   - Find user by id, set isBlocked = true, save
//
// deleteUser(req, res, next)
//   - Find user by id and remove it
//
// getAllBookings(req, res, next)
//   - Return all bookings, populated with user (name) and event (title)
//
// Note: Event CRUD (add/edit/delete/view) reuses events.controller.js
// functions, just guarded by the admin middleware.
