import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  createEvent,
  deleteEvent,
  getEvents,
  updateEvent,
} from "../../services/adminService";
import "./admin.css";

const emptyForm = {
  title: "",
  description: "",
  category: "",
  location: "",
  date: "",
  time: "",
  price: "",
  capacity: "",
};

const toInputDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getEvents({ limit: 100 });
      setEvents(data.events || data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.location.trim() ||
      !form.date ||
      form.price === "" ||
      form.capacity === ""
    ) {
      setError("Please fill all required event fields.");
      return;
    }

    const price = Number(form.price);
    const capacity = Number(form.capacity);

    if (!Number.isFinite(price) || price < 0) {
      setError("Price must be a valid non-negative number.");
      return;
    }

    if (!Number.isInteger(capacity) || capacity <= 0) {
      setError("Capacity must be a positive whole number.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      location: form.location.trim(),
      date: form.date,
      time: form.time,
      price,
      capacity,
    };

    setSaving(true);

    try {
      if (editingId) {
        await updateEvent(editingId, payload);
        setMessage("Event updated successfully.");
      } else {
        await createEvent(payload);
        setMessage("Event created successfully.");
      }

      resetForm();
      await loadEvents();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (event) => {
    setEditingId(event._id);
    setForm({
      title: event.title || "",
      description: event.description || "",
      category: event.category || "",
      location: event.location || "",
      date: toInputDate(event.date),
      time: event.time || "",
      price: event.price ?? "",
      capacity: event.capacity ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (event) => {
    if (!window.confirm(`Delete "${event.title}"? This cannot be undone.`)) {
      return;
    }

    setError("");
    setMessage("");

    try {
      await deleteEvent(event._id);
      setEvents((current) => current.filter((item) => item._id !== event._id));

      if (editingId === event._id) {
        resetForm();
      }

      setMessage("Event deleted successfully.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="admin-page">
      <div className="admin-shell">
        <header className="admin-header">
          <div>
            <h1>Manage Events</h1>
            <p>Create, edit, and delete events.</p>
          </div>
        </header>

        <nav className="admin-nav" aria-label="Admin navigation">
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/events">Events</Link>
          <Link to="/admin/users">Users</Link>
          <Link to="/admin/bookings">Bookings</Link>
        </nav>

        <section className="admin-panel" style={{ marginBottom: 20 }}>
          <h2>{editingId ? "Edit Event" : "Add Event"}</h2>

          <form className="admin-form" onSubmit={handleSubmit}>
            <div className="admin-form-grid">
              <label>
                Title *
                <input name="title" value={form.title} onChange={handleChange} />
              </label>

              <label>
                Category
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Workshop, Course, Concert..."
                />
              </label>

              <label>
                Location *
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                />
              </label>

              <label>
                Date *
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                />
              </label>

              <label>
                Time
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                />
              </label>

              <label>
                Price *
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                />
              </label>

              <label>
                Capacity *
                <input
                  type="number"
                  min="1"
                  step="1"
                  name="capacity"
                  value={form.capacity}
                  onChange={handleChange}
                />
              </label>
            </div>

            <label>
              Description *
              <textarea
                rows="4"
                name="description"
                value={form.description}
                onChange={handleChange}
              />
            </label>

            <div className="admin-actions">
              <button className="admin-button primary" disabled={saving}>
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Event"
                    : "Create Event"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="admin-button"
                  onClick={resetForm}
                  disabled={saving}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {message && <div className="admin-message success">{message}</div>}
        {error && <div className="admin-message error">{error}</div>}

        <section className="admin-panel">
          {loading ? (
            <div className="admin-empty">Loading events...</div>
          ) : events.length === 0 ? (
            <div className="admin-empty">No events found.</div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Date</th>
                    <th>Location</th>
                    <th>Price</th>
                    <th>Seats</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event._id}>
                      <td>{event.title}</td>
                      <td>{toInputDate(event.date) || "—"}</td>
                      <td>{event.location || "—"}</td>
                      <td>{event.price ?? "—"}</td>
                      <td>
                        {Math.max(
                          Number(event.capacity || 0) -
                            Number(event.bookedSeats || 0),
                          0
                        )}
                        {" / "}
                        {event.capacity ?? "—"}
                      </td>
                      <td>
                        <div className="admin-actions">
                          <button
                            className="admin-button"
                            onClick={() => startEdit(event)}
                          >
                            Edit
                          </button>
                          <button
                            className="admin-button danger"
                            onClick={() => handleDelete(event)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
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

export default ManageEvents;
