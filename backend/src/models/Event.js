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
