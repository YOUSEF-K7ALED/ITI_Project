// Admin API service (Person 4)
//
// This service intentionally keeps the Admin vertical slice self-contained
// while the shared `services/api.js` is still being implemented by the team.
//
// NEXT INTEGRATION NOTE:
// Once the shared API client is finalized, replace `request()` below with
// that client so authentication/error handling is centralized in one place.
// The public method signatures should remain unchanged.

const API_BASE_URL =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_URL) ||
  "http://localhost:5000/api";

const getToken = () => localStorage.getItem("token");

const request = async (path, options = {}) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    const error = new Error(data.message || "Request failed");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const getDashboardStats = () => request("/admin/stats");

export const getAllUsers = (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    }
  });

  const suffix = query.toString() ? `?${query.toString()}` : "";
  return request(`/admin/users${suffix}`);
};

export const blockUser = (userId) =>
  request(`/admin/users/${userId}/block`, {
    method: "PUT",
  });

export const deleteUser = (userId) =>
  request(`/admin/users/${userId}`, {
    method: "DELETE",
  });

export const getAllBookings = (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    }
  });

  const suffix = query.toString() ? `?${query.toString()}` : "";
  return request(`/admin/bookings${suffix}`);
};

// Admin event management uses the shared /api/events endpoints.
// Person 2 owns the event controller/routes; do not duplicate that backend logic.
export const getEvents = (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    }
  });

  const suffix = query.toString() ? `?${query.toString()}` : "";
  return request(`/events${suffix}`);
};

export const createEvent = (eventData) =>
  request("/events", {
    method: "POST",
    body: JSON.stringify(eventData),
  });

export const updateEvent = (eventId, eventData) =>
  request(`/events/${eventId}`, {
    method: "PUT",
    body: JSON.stringify(eventData),
  });

export const deleteEvent = (eventId) =>
  request(`/events/${eventId}`, {
    method: "DELETE",
  });
