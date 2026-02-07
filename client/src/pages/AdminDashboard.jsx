import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { sendNewsletter } from "../api/newsletter";
import "../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("blog"); // blog, newsletter

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
          className={`admin-tab ${activeTab === "newsletter" ? "active" : ""}`}
          onClick={() => setActiveTab("newsletter")}
        >
          Newsletter
        </button>
      </div>

      {/* Tab Content */}
      <div className="admin-content">
        {activeTab === "blog" && <BlogManagement />}
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
