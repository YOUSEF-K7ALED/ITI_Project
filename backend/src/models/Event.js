// Mongoose schema/model: Event
// Fields:
//   - title: String, required
//   - description: String, required
//   - category: String (e.g. "Concert", "Workshop", "Course", "Sports Event", "Conference")
//   - location: String, required
//   - date: Date, required
//   - time: String
//   - price: Number, required
//   - capacity: Number, required        // total seats
//   - bookedSeats: Number, default 0    // seats already booked
//   - createdBy: ObjectId ref "User"    // admin who created it
//   - timestamps: true
//
// Notes:
//   - availableSeats = capacity - bookedSeats (can be a virtual field)
//   - Used for Search & Filter (title, category, location, price, date)


const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({

title:{ type: String, required: true , trim: true },
description:{ type: String, required: true , trim: true },
category:{ type: String, required: true , trim: true ,enum: ["Concert", "Workshop", "Course", "Sports Event", "Conference" ,"Arts Event"]},
location:{ type: String, required: true , trim: true },
date:{ type: Date, required: true },
time:{ type: String, trim: true },
price:{ type: Number, required: true , min: 0 },
capacity:{ type: Number, required: true , min: 1 },
bookedSeats:{ type: Number, default: 0 , min: 0 },
createdBy:{ type: mongoose.Schema.Types.ObjectId, ref: "User" } ,

},{ timestamps: true });

eventSchema.virtual('availableSeats').get(function() {
  return this.capacity - this.bookedSeats;
})


eventSchema.set('toJSON', { virtuals: true });


module.exports = mongoose.model('Event', eventSchema);