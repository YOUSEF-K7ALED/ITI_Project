import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllBookings } from "../../services/adminService";
import "./admin.css";

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
};

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getAllBookings({ status, limit: 100 });
      setBookings(data.bookings || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  return (
    <main className="admin-page">
      <div className="admin-shell">
        <header className="admin-header">
          <div>
            <h1>Manage Bookings</h1>
            <p>Review booking history and current statuses.</p>
          </div>
        </header>

        <nav className="admin-nav" aria-label="Admin navigation">
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/events">Events</Link>
          <Link to="/admin/users">Users</Link>
          <Link to="/admin/bookings">Bookings</Link>
        </nav>

        <section className="admin-panel">
          <div className="admin-toolbar">
            <select
              className="admin-select"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              aria-label="Filter bookings by status"
            >
              <option value="">All statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {error && <div className="admin-message error">{error}</div>}

          {loading ? (
            <div className="admin-empty">Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="admin-empty">No bookings found.</div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Event</th>
                    <th>Status</th>
                    <th>Booking date</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>
                        {booking.user?.name || "Deleted user"}
                        {booking.user?.email && (
                          <div>{booking.user.email}</div>
                        )}
                      </td>
                      <td>{booking.event?.title || "Deleted event"}</td>
                      <td>
                        <span
                          className={`admin-status ${
                            booking.status === "confirmed"
                              ? "success"
                              : "danger"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td>{formatDate(booking.bookingDate || booking.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default ManageBookings;
