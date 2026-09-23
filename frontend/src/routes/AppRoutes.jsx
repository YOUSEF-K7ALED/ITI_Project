// Central route definitions (shared, integrated by all 5)
// - /login, /register                     -> Auth pages (Person 1)
// - /                                       -> Events list (Person 2)
// - /events/:id                            -> Event details (Person 2)
// - /my-bookings                           -> My Bookings (Person 3, protected)
// - /profile, /profile/edit, /profile/password -> Profile pages (Person 5, protected)
// - /admin, /admin/events, /admin/users, /admin/bookings -> Admin pages (Person 4, admin-protected)
//
// Use a <ProtectedRoute> wrapper for logged-in-only pages
// Use an <AdminRoute> wrapper for admin-only pages
