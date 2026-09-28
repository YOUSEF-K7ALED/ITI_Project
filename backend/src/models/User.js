// Mongoose schema/model: User
// Fields:
//   - name: String, required
//   - email: String, required, unique, lowercase
//   - password: String, required (hashed with bcrypt before save)
//   - role: String, enum ["user", "admin"], default "user"
//   - isBlocked: Boolean, default false   (used by Admin - Manage Users)
//   - timestamps: true
//
// Hooks:
//   - pre("save") hook: hash password with bcrypt if it was modified
// Methods:
//   - comparePassword(candidatePassword): compares plain password with hashed one


const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);