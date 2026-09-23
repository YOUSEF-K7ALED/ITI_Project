// Routes: /api/events   (Person 2 - Events)
// - GET    /            -> events.controller.getEvents      (public, supports search/filter/pagination)
// - GET    /:id         -> events.controller.getEventById   (public)
// - POST   /            -> protect, isAdmin -> events.controller.createEvent
// - PUT    /:id         -> protect, isAdmin -> events.controller.updateEvent
// - DELETE /:id         -> protect, isAdmin -> events.controller.deleteEvent
