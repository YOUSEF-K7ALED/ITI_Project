// Controller: Profile (Person 5)
//
// getProfile(req, res, next)
//   - Return req.user (already attached by auth middleware, no password)
//
// updateProfile(req, res, next)
//   - Get { name, email } from req.body
//   - Find req.user._id, update fields, save
//   - Return updated user
//
// changePassword(req, res, next)
//   - Get { currentPassword, newPassword } from req.body
//   - Verify currentPassword with user.comparePassword()
//   - If invalid -> 400 "Current password is incorrect"
//   - Set user.password = newPassword (hashed by pre-save hook), save
//
// (Optional) notifications endpoints if the feature is implemented later
