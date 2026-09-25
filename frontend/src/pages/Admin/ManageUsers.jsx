import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  blockUser,
  deleteUser,
  getAllUsers,
} from "../../services/adminService";
import "./admin.css";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getAllUsers({ search, limit: 100 });
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(loadUsers, 250);
    return () => clearTimeout(timer);
  }, [loadUsers]);

  const handleBlock = async (user) => {
    if (!window.confirm(`Block ${user.name}?`)) return;

    setActionId(user._id);
    setError("");
    setMessage("");

    try {
      await blockUser(user._id);
      setMessage("User blocked successfully.");
      await loadUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionId("");
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete ${user.name}? This cannot be undone.`)) return;

    setActionId(user._id);
    setError("");
    setMessage("");

    try {
      await deleteUser(user._id);
      setUsers((current) => current.filter((item) => item._id !== user._id));
      setMessage("User deleted successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setActionId("");
    }
  };

  return (
    <main className="admin-page">
      <div className="admin-shell">
        <header className="admin-header">
          <div>
            <h1>Manage Users</h1>
            <p>Review accounts and manage user access.</p>
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
            <input
              className="admin-input"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or email"
              aria-label="Search users"
            />
          </div>

          {message && <div className="admin-message success">{message}</div>}
          {error && <div className="admin-message error">{error}</div>}

          {loading ? (
            <div className="admin-empty">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="admin-empty">No users found.</div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        <span
                          className={`admin-status ${
                            user.isBlocked ? "danger" : "success"
                          }`}
                        >
                          {user.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>
                      <td>
                        <div className="admin-actions">
                          {user.role !== "admin" && !user.isBlocked && (
                            <button
                              className="admin-button"
                              disabled={actionId === user._id}
                              onClick={() => handleBlock(user)}
                            >
                              Block
                            </button>
                          )}

                          {user.role !== "admin" && (
                            <button
                              className="admin-button danger"
                              disabled={actionId === user._id}
                              onClick={() => handleDelete(user)}
                            >
                              Delete
                            </button>
                          )}
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

export default ManageUsers;
