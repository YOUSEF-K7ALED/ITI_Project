// Main Express app setup
// - Import express, cors, morgan (or similar logger)
// - Initialize the app: const app = express()
// - Apply global middleware: express.json(), cors(), logger
// - Mount route files:
//     /api/auth      -> auth.routes.js       (Person 1 - Authentication)
//     /api/events    -> events.routes.js     (Person 2 - Events)
//     /api/bookings  -> bookings.routes.js   (Person 3 - Bookings)
//     /api/admin     -> admin.routes.js      (Person 4 - Admin)
//     /api/profile   -> profile.routes.js    (Person 5 - Profile)
// - Add a 404 handler for unknown routes
// - Add the global error handler middleware (must be last)
// - Export the app
