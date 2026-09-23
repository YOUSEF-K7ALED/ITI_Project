# Event Booking System - Backend

## Setup
1. `npm install`
2. Copy `.env.example` to `.env` and fill in real values
3. `npm run dev` (or `npm start`)

## Structure
- src/config      -> DB connection
- src/models      -> Mongoose schemas (User, Event, Booking)
- src/controllers -> Business logic, split by feature/person
- src/routes      -> Express routers, split by feature/person
- src/middleware  -> auth (JWT), admin guard, error handler
- src/utils       -> helpers (JWT generation)

## Feature ownership (matches team split)
- Person 1: auth.controller.js, auth.routes.js
- Person 2: events.controller.js, events.routes.js
- Person 3: bookings.controller.js, bookings.routes.js
- Person 4: admin.controller.js, admin.routes.js
- Person 5: profile.controller.js, profile.routes.js
