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

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");
const eventRoutes = require("./routes/events.routes");
const adminRoutes = require("./routes/admin.routes");
const profileRoutes = require("./routes/profile.routes");
const bookingRoutes = require("./routes/bookings.routes");
const { notFound, errorHandler } = require("./middleware/error.middleware");

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use(express.static(require("path").join(__dirname, "../../frontend")));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
