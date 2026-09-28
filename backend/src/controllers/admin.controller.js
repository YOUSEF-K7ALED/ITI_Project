const mongoose = require("mongoose");

const User = require("../models/User");
const Event = require("../models/Event");
const Booking = require("../models/Booking");

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

const parsePagination = (req) => {
  const page = Math.max(Number.parseInt(req.query.page, 10) || DEFAULT_PAGE, 1);
  const requestedLimit =
    Number.parseInt(req.query.limit, 10) || DEFAULT_LIMIT;
  const limit = Math.min(Math.max(requestedLimit, 1), MAX_LIMIT);

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
};

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const publicUserProjection = "-password";

/**
 * GET /api/admin/stats
 *
 * Dashboard overview. Counts are deliberately calculated from the database
 * instead of being stored counters, so the values remain consistent after
 * bookings/users/events are created or removed.
 */
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [usersCount, eventsCount, bookingsCount, blockedUsersCount] =
      await Promise.all([
        User.countDocuments(),
        Event.countDocuments(),
        Booking.countDocuments(),
        User.countDocuments({ isBlocked: true }),
      ]);

    res.status(200).json({
      success: true,
      stats: {
        usersCount,
        eventsCount,
        bookingsCount,
        blockedUsersCount,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/users
 *
 * Optional query parameters:
 *   ?page=1&limit=20&search=ahmed&role=user&isBlocked=true
 *
 * Passwords are never returned.
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req);
    const { search, role, isBlocked } = req.query;

    const filter = {};

    if (search && search.trim()) {
      const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { name: { $regex: escapedSearch, $options: "i" } },
        { email: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    if (role === "user" || role === "admin") {
      filter.role = role;
    }

    if (isBlocked === "true" || isBlocked === "false") {
      filter.isBlocked = isBlocked === "true";
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select(publicUserProjection)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/admin/users/:id/block
 *
 * Blocking is intentionally one-way here because that is the endpoint
 * specified by the project brief. An unblock endpoint can be added later
 * without changing the existing block contract.
 */
exports.blockUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    if (String(req.user._id) === String(id)) {
      return res.status(400).json({
        success: false,
        message: "An admin cannot block their own account",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "Admin accounts cannot be blocked from this endpoint",
      });
    }

    if (user.isBlocked) {
      return res.status(409).json({
        success: false,
        message: "User is already blocked",
      });
    }

    user.isBlocked = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User blocked successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/admin/users/:id
 *
 * Deleting an account does not automatically delete its bookings. Keeping
 * historical bookings is intentional for the admin booking history.
 * If the team later chooses cascading deletion, implement it in one shared
 * service/transaction rather than adding it only to the UI.
 */
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    if (String(req.user._id) === String(id)) {
      return res.status(400).json({
        success: false,
        message: "An admin cannot delete their own account",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "Admin accounts cannot be deleted from this endpoint",
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/bookings
 *
 * Returns booking history with the minimum useful user/event fields.
 * Optional query parameters:
 *   ?page=1&limit=20&status=confirmed
 */
exports.getAllBookings = async (req, res, next) => {
  try {
    const { page, limit, skip } = parsePagination(req);
    const { status } = req.query;

    const filter = {};

    if (status === "confirmed" || status === "cancelled") {
      filter.status = status;
    }

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate("user", "name email")
        .populate("event", "title date location price")
        .sort({ createdAt: -1, bookingDate: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Booking.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      bookings,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};
