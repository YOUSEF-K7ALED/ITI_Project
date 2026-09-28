# Person 4 — Admin Files

This archive contains ONLY the files owned by Person 4 (Admin).

Do not copy or overwrite files owned by Persons 1, 2, 3, or 5.

## Backend
- backend/src/controllers/admin.controller.js
- backend/src/routes/admin.routes.js
- backend/src/middleware/admin.middleware.js

## Frontend
- frontend/src/pages/Admin/Dashboard.jsx
- frontend/src/pages/Admin/ManageUsers.jsx
- frontend/src/pages/Admin/ManageEvents.jsx
- frontend/src/pages/Admin/ManageBookings.jsx
- frontend/src/pages/Admin/admin.css
- frontend/src/services/adminService.js

## Required integration by the team
The existing shared files must remain owned by their respective team members. They only need to mount the Admin route and register the Admin frontend routes in their shared routing files.

Backend mount:
  app.use("/api/admin", adminRoutes);

Frontend routes:
  /admin
  /admin/events
  /admin/users
  /admin/bookings

The Admin code does not include or replace any User/Event/Booking/Auth/Profile files.
