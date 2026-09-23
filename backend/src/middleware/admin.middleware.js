// "isAdmin" middleware (Person 4 - Admin)
// - Runs AFTER auth.middleware (req.user must already be set)
// - Check if req.user.role === "admin"
// - If not -> 403 Forbidden ("Access denied")
// - Else -> next()
