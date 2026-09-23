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
