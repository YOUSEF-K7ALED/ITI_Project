// Routes: /api/events   (Person 2 - Events)
// - GET    /            -> events.controller.getEvents      (public, supports search/filter/pagination)
// - GET    /:id         -> events.controller.getEventById   (public)
// - POST   /            -> protect, isAdmin -> events.controller.createEvent
// - PUT    /:id         -> protect, isAdmin -> events.controller.updateEvent
// - DELETE /:id         -> protect, isAdmin -> events.controller.deleteEvent
const express = require("express");
const router = express.Router();
const eventsController = require("../controllers/events.controller");
// const { protect} = require("../middleware/auth.middleware");  
// const { isAdmin } = require("../middleware/adimin.middleware");


router.get("/", eventsController.getEvents);
router.get("/:id", eventsController.getEventById);
 router.post("/", /*protect, isAdmin,*/ eventsController.createEvent);
 router.put("/:id", /*protect, isAdmin,*/ eventsController.updateEvent);
 router.delete("/:id",/* protect, isAdmin,*/ eventsController.deleteEvent);


 module.exports = router;