// Mongoose schema/model: Booking
// Fields:
//   - user: ObjectId ref "User", required
//   - event: ObjectId ref "Event", required
//   - status: String, enum ["confirmed", "cancelled"], default "confirmed"
//   - bookingDate: Date, default Date.now
//   - timestamps: true
//
// Notes:
//   - Add a compound index/check in controller logic to prevent
//     a user from booking the same event twice (duplicate booking rule)
