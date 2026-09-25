// Admin authorization middleware (Person 4)
//
// IMPORTANT:
// - `protect` MUST run before `isAdmin`, because this middleware expects req.user.
// - Keep role checks here instead of duplicating them inside controllers.
// - The block flag is intentionally NOT handled here. Person 1 should make
//   auth.middleware reject blocked accounts globally if that is the team's policy.

exports.isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }

  next();
};
