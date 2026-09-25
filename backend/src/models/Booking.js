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
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },

    bookingDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// The combination of user + event must be unique to prevent booking the same event more than one time for the user
bookingSchema.index({ user: 1, event: 1 }, { unique: true });

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
