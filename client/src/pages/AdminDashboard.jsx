import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { createShow, fetchShows, deleteShow } from "../api/shows";
import { sendNewsletter } from "../api/newsletter";
import "../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("blog"); // blog, shows, newsletter

  // Redirect if not logged in
  if (!user) {
    navigate("/admin/login");
    return null;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-header-actions">
          <span className="admin-user">Welcome, {user.email}</span>
          <button onClick={logout} className="admin-logout-btn">Logout</button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === "blog" ? "active" : ""}`}
          onClick={() => setActiveTab("blog")}
        >
          Blog Posts
        </button>
        <button
          className={`admin-tab ${activeTab === "shows" ? "active" : ""}`}
          onClick={() => setActiveTab("shows")}
        >
          Upcoming Shows
        </button>
        <button
          className={`admin-tab ${activeTab === "newsletter" ? "active" : ""}`}
          onClick={() => setActiveTab("newsletter")}
        >
          Newsletter
        </button>
      </div>

      {/* Tab Content */}
      <div className="admin-content">
        {activeTab === "blog" && <BlogManagement />}
        {activeTab === "shows" && <ShowsManagement />}
        {activeTab === "newsletter" && <NewsletterManagement />}
      </div>
    </div>
  );
}

// Blog Management Component
function BlogManagement() {
  const navigate = useNavigate();

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>Blog Posts</h2>
        <button
          onClick={() => navigate("/blog/new")}
          className="admin-btn-primary"
        >
          + New Blog Post
        </button>
      </div>
      <p className="admin-hint">
        Create, edit, and delete blog posts. Click "New Blog Post" to create a post with text, photos, and/or videos.
      </p>
      <button
        onClick={() => navigate("/blog")}
        className="admin-btn-secondary"
      >
        View All Blog Posts
      </button>
    </div>
  );
}

// Shows Management Component
function ShowsManagement() {
  const [showForm, setShowForm] = useState({
    date: "",
    time: "",
    venue: "",
    city: "",
    ticketUrl: ""
  });
  const [addStatus, setAddStatus] = useState("");
  const [showsList, setShowsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadShows();
  }, []);

  const loadShows = async () => {
    try {
      const shows = await fetchShows();
      setShowsList(shows);
    } catch (error) {
      console.error("Failed to fetch shows:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteShow = async (id) => {
    if (!window.confirm("Are you sure you want to delete this show?")) {
      return;
    }

    try {
      await deleteShow(id);
      setAddStatus("Show deleted successfully!");
      loadShows(); // Reload the list
      setTimeout(() => setAddStatus(""), 3000);
    } catch (error) {
      console.error("Failed to delete show:", error);
      setAddStatus("Failed to delete show. Please try again.");
      setTimeout(() => setAddStatus(""), 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAddStatus("");

    try {
      const payload = {
        date: showForm.date,
        time: showForm.time,
        venue: showForm.venue,
        city: showForm.city,
        ticketUrl: showForm.ticketUrl
      };

      await createShow(payload);
      setAddStatus("Show added successfully!");

      // Reset form
      setShowForm({
        date: "",
        time: "",
        venue: "",
        city: "",
        ticketUrl: ""
      });

      // Reload shows list
      loadShows();

      setTimeout(() => setAddStatus(""), 3000);
    } catch (error) {
      console.error("Failed to add show:", error);
      setAddStatus("Failed to add show. Please try again.");
      setTimeout(() => setAddStatus(""), 3000);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>Upcoming Shows</h2>
      </div>
      <p className="admin-hint">
        Add, update, and delete upcoming shows. These will appear on the Shows page with ticket purchase links.
      </p>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label>Date</label>
            <input
              type="text"
              value={showForm.date}
              onChange={(e) => setShowForm({ ...showForm, date: e.target.value })}
              placeholder="e.g., Feb. 3, 2026"
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Time</label>
            <input
              type="text"
              value={showForm.time}
              onChange={(e) => setShowForm({ ...showForm, time: e.target.value })}
              placeholder="e.g., 7:00 PM"
              required
            />
          </div>
        </div>

        <div className="admin-form-group">
          <label>Venue Name</label>
          <input
            type="text"
            value={showForm.venue}
            onChange={(e) => setShowForm({ ...showForm, venue: e.target.value })}
            placeholder="e.g., SODA BAR"
            required
          />
        </div>

        <div className="admin-form-group">
          <label>City, State</label>
          <input
            type="text"
            value={showForm.city}
            onChange={(e) => setShowForm({ ...showForm, city: e.target.value })}
            placeholder="e.g., San Diego, CA"
            required
          />
        </div>

        <div className="admin-form-group">
          <label>Ticket Purchase URL</label>
          <input
            type="url"
            value={showForm.ticketUrl}
            onChange={(e) => setShowForm({ ...showForm, ticketUrl: e.target.value })}
            placeholder="https://www.eventbrite.com/your-event"
            required
          />
        </div>

        <button type="submit" className="admin-btn-primary">
          Add Show
        </button>

        {addStatus && <p className="admin-success">{addStatus}</p>}
      </form>

      {/* Existing Shows List */}
      <div style={{ marginTop: 40 }}>
        <h3 style={{ color: "#ff69b4", marginBottom: 20 }}>Upcoming Shows</h3>
        {loading ? (
          <p style={{ color: "#888" }}>Loading shows...</p>
        ) : showsList.length === 0 ? (
          <p style={{ color: "#888" }}>No shows yet. Add one above!</p>
        ) : (
          <div className="shows-list-admin">
            {showsList.map((show) => (
              <div key={show._id} className="show-list-item">
                <div className="show-list-info">
                  <h4>{show.venue}</h4>
                  <p className="show-list-details">
                    📅 {show.date} at {show.time}
                  </p>
                  <p className="show-list-city">📍 {show.city}</p>
                  <a href={show.ticketUrl} target="_blank" rel="noopener noreferrer" className="show-list-link">
                    🎫 Tickets
                  </a>
                </div>
                <button
                  onClick={() => handleDeleteShow(show._id)}
                  className="show-delete-btn"
                  title="Delete this show"
                >
                  🗑️ Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Newsletter Management Component
function NewsletterManagement() {
  const [newsletter, setNewsletter] = useState({
    subject: "",
    message: "",
    sendTo: "all" // all, music, merch, shows
  });
  const [sendStatus, setSendStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSendStatus("");

    try {
      const payload = {
        subject: newsletter.subject,
        message: newsletter.message,
        segment: newsletter.sendTo
      };

      const result = await sendNewsletter(payload);
      setSendStatus(result.message || `Newsletter sent successfully to ${result.count || 0} subscribers!`);

      // Reset form
      setNewsletter({
        subject: "",
        message: "",
        sendTo: "all"
      });

      setTimeout(() => setSendStatus(""), 5000);
    } catch (error) {
      console.error("Failed to send newsletter:", error);
      const errorMessage = error.response?.data?.error || "Failed to send newsletter. Please check your email configuration and try again.";
      setSendStatus(errorMessage);
      setTimeout(() => setSendStatus(""), 5000);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>Newsletter</h2>
      </div>
      <p className="admin-hint">
        Send email updates to your mailing list. Subscribers can choose to receive updates about music, merch, shows, or all three.
      </p>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="admin-form-group">
          <label>Send To</label>
          <select
            value={newsletter.sendTo}
            onChange={(e) => setNewsletter({ ...newsletter, sendTo: e.target.value })}
          >
            <option value="all">All Subscribers</option>
            <option value="music">Music Subscribers</option>
            <option value="merch">Merch Subscribers</option>
            <option value="shows">Show Subscribers</option>
          </select>
        </div>

        <div className="admin-form-group">
          <label>Subject Line</label>
          <input
            type="text"
            value={newsletter.subject}
            onChange={(e) => setNewsletter({ ...newsletter, subject: e.target.value })}
            placeholder="e.g., New Album Released!"
            required
          />
        </div>

        <div className="admin-form-group">
          <label>Message</label>
          <textarea
            value={newsletter.message}
            onChange={(e) => setNewsletter({ ...newsletter, message: e.target.value })}
            placeholder="Write your newsletter message here..."
            rows={10}
            required
          />
        </div>

        <button type="submit" className="admin-btn-primary">
          Send Newsletter
        </button>

        {sendStatus && <p className="admin-success">{sendStatus}</p>}
      </form>
    </div>
  );
}
