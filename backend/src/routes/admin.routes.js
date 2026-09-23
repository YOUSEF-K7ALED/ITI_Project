// Routes: /api/admin   (Person 4 - Admin)
// All routes require "protect" + "isAdmin" middleware
// - GET    /stats            -> admin.controller.getDashboardStats
// - GET    /users             -> admin.controller.getAllUsers
// - PUT    /users/:id/block   -> admin.controller.blockUser
// - DELETE /users/:id         -> admin.controller.deleteUser
// - GET    /bookings          -> admin.controller.getAllBookings
// (Event management reuses /api/events routes with isAdmin)
