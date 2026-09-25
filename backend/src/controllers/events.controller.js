// Controller: Events (Person 2)
//


const Event = require('../models/Event.js');

const {fromZonedTime} = require('date-fns-tz');








// getEvents(req, res, next)
//   - Support query params: search (title), category, location, price (max), date
//   - Support pagination: page, limit
//   - Build a Mongoose filter object from query params
//   - Return list of events + pagination info (total, page, pages)
//
exports.getEvents=async(req, res, next)=>{

try {
    const { search, minPrice, maxPrice, category , minCapacity, maxCapacity , location , date ,page=1, limit=10} = req.query;
    const query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    } 

    if (minCapacity||maxCapacity) {
      query.capacity = {};
      if (minCapacity) query.capacity.$gte = Number(minCapacity);
      if (maxCapacity) query.capacity.$lte = Number(maxCapacity);
    }

    if (category) {
      query.category = { $regex: category, $options: "i" };
    }


    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (date) {
   const tz=req.user?.timezone||"Africa/Cairo"
   const start=fromZonedTime(`${date} 00:00:00`,tz)
   const end=new Date(start)
   end.setUTCDate(end.getUTCDate()+1)
   query.date={$gte:start,$lt:end}
    }


const skip = (Number(page) - 1) * Number(limit);

const [events,total] = await Promise.all([
  Event.find(query).sort({date:1}).skip(skip).limit(Number(limit)),
  Event.countDocuments(query)
]);

res.json({ success: true, data:events, pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) } });

} catch (err) {
    next(err);
  }
};




// getEventById(req, res, next)
//   - Find event by req.params.id
//   - If not found -> 404
//   - Return event details (include availableSeats)



exports.getEventById=async(req, res, next)=>{
try {
    const event = await Event.findById(req.params.id);
if (!event) {
  return res.status(404).json({ success: false, message: "Event not found" });
}

res.json({ success: true, data: event });
}

catch (err) {
    next(err);
  }
};



//
// createEvent(req, res, next)      [admin only, also used by Person 4]
//   - Create a new event from req.body
//   - Attach createdBy = req.user._id

    exports.createEvent=async(req, res, next)=>{
try{
const event=await Event.create(req.body)
//const event=await Event.create({ ...req.body, createdBy: req.user._id });
res.json({ success: true, message: "Event created", data: event });
}catch(err){
    next(err);
  }
    }


//
// updateEvent(req, res, next)      [admin only]
//   - Find event by id, update fields, save


exports.updateEvent=async(req, res, next)=>{
try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
if (!event) {
  return res.status(404).json({ success: false, message: "Event not found" });
}
res.json({ success: true, message: "Event updated", data: event });}
catch (err) {
    next(err);
  }}




//
// deleteEvent(req, res, next)      [admin only]
//   - Find event by id and remove it
exports.deleteEvent=async(req, res, next)=>{
try {
    const event = await Event.findByIdAndDelete(req.params.id);
if (!event) {
  return res.status(404).json({ success: false, message: "Event not found" });
}
res.json({ success: true, message: "Event deleted" });
} catch (err) {
    next(err);
  }
};


