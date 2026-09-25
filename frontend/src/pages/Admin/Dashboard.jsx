import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboardStats } from "../../services/adminService";
import "./admin.css";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getDashboardStats()
      .then((data) => {
        if (active) setStats(data.stats);
      })
      .catch((err) => {
        if (active) setError(err.message);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="admin-page">
      <div className="admin-shell">
        <header className="admin-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Overview of the event booking system.</p>
          </div>
        </header>

        <nav className="admin-nav" aria-label="Admin navigation">
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/events">Events</Link>
          <Link to="/admin/users">Users</Link>
          <Link to="/admin/bookings">Bookings</Link>
        </nav>

        {error && <div className="admin-message error">{error}</div>}

        <section className="admin-grid" aria-label="Dashboard statistics">
          <div className="admin-card">
            <span>Users</span>
            <strong>{stats?.usersCount ?? "—"}</strong>
          </div>
          <div className="admin-card">
            <span>Events</span>
            <strong>{stats?.eventsCount ?? "—"}</strong>
          </div>
          <div className="admin-card">
            <span>Bookings</span>
            <strong>{stats?.bookingsCount ?? "—"}</strong>
          </div>
        </section>

        {stats && (
          <section className="admin-panel">
            <strong>Blocked users: {stats.blockedUsersCount ?? 0}</strong>
          </section>
        )}
      </div>
    </main>
  );
};

export default Dashboard;
