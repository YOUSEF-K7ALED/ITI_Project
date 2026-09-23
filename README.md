# Event Booking System

Empty project skeleton, organized by feature so each of the 5 team members
can own one vertical slice (Frontend + Backend) as described in the project brief.

## Structure
- backend/   -> Node.js + Express + MongoDB (Mongoose) API
- frontend/  -> React app (assumed SPA framework), organized by feature

## Team split
| Person | Feature        | Backend files                                   | Frontend files                                  |
|--------|----------------|--------------------------------------------------|--------------------------------------------------|
| 1      | Authentication | auth.controller.js, auth.routes.js                | pages/Auth/*, components/Auth/*                   |
| 2      | Events         | events.controller.js, events.routes.js            | pages/Events/*, components/Events/*               |
| 3      | Bookings       | bookings.controller.js, bookings.routes.js        | pages/Bookings/*, components/Bookings/*           |
| 4      | Admin          | admin.controller.js, admin.routes.js              | pages/Admin/*                                     |
| 5      | Profile        | profile.controller.js, profile.routes.js          | pages/Profile/*, components/Profile/*             |

Shared/integration files (context, services, routes, models, middleware, config)
are used by everyone and should be agreed on together before each person starts.

Next step order: Register/Login -> Events -> Event Details -> Booking -> My Bookings -> Admin.
