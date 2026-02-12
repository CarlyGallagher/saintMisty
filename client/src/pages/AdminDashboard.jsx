import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { sendNewsletter } from "../api/newsletter";
import { fetchPresave, updatePresave, deletePresave } from "../api/presave";
import "../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("blog"); // blog, newsletter, presave

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
        <button
          className={`admin-tab ${activeTab === "presave" ? "active" : ""}`}
          onClick={() => setActiveTab("presave")}
        >
          Pre-Save
        </button>
      </div>

      {/* Tab Content */}
      <div className="admin-content">
        {activeTab === "blog" && <BlogManagement />}
        {activeTab === "newsletter" && <NewsletterManagement />}
        {activeTab === "presave" && <PresaveManagement />}
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

// Pre-Save Management Component
function PresaveManagement() {
  const [presave, setPresave] = useState({ songName: "", text: "", url: "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchPresave();
        setPresave({ songName: data.songName, text: data.text || "", url: data.url });
      } catch (error) {
        // 404 means no presave configured yet, that's fine
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    try {
      await updatePresave(presave);
      setStatus("Pre-save updated successfully!");
      setTimeout(() => setStatus(""), 5000);
    } catch (error) {
      console.error("Failed to update pre-save:", error);
      setStatus("Failed to update pre-save. Please try again.");
      setTimeout(() => setStatus(""), 5000);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete the current pre-save? The homepage will show the default Extended Network card.")) return;
    setStatus("");

    try {
      await deletePresave();
      setPresave({ songName: "", text: "", url: "" });
      setStatus("Pre-save deleted successfully.");
      setTimeout(() => setStatus(""), 5000);
    } catch (error) {
      console.error("Failed to delete pre-save:", error);
      setStatus("Failed to delete pre-save. Please try again.");
      setTimeout(() => setStatus(""), 5000);
    }
  };

  if (loading) {
    return (
      <div className="admin-section">
        <p style={{ color: "#888" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>Pre-Save</h2>
      </div>
      <p className="admin-hint">
        Update the current pre-save song. This will be shown on the homepage and in the Music navigation dropdown.
        Use <strong>{"{name}"}</strong> in the text field to place the song name. It will be styled in bold red.
      </p>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="admin-form-group">
          <label>Song Name</label>
          <input
            type="text"
            value={presave.songName}
            onChange={(e) => setPresave({ ...presave, songName: e.target.value })}
            placeholder="e.g., Poison"
            required
          />
        </div>

        <div className="admin-form-group">
          <label>Display Text</label>
          <input
            type="text"
            value={presave.text}
            onChange={(e) => setPresave({ ...presave, text: e.target.value })}
            placeholder="e.g., Pre Save {name} today!"
            required
          />
          <small style={{ color: "#888", marginTop: "4px", display: "block" }}>
            Examples: "Pre Save {"{name}"} today!" · "{"{name}"} out now" · "Listen to {"{name}"} Now!"
          </small>
        </div>

        <div className="admin-form-group">
          <label>Pre-Save URL</label>
          <input
            type="url"
            value={presave.url}
            onChange={(e) => setPresave({ ...presave, url: e.target.value })}
            placeholder="e.g., https://share.amuse.io/track/saint-misty-poison"
            required
          />
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button type="submit" className="admin-btn-primary">
            Update Pre-Save
          </button>
          {presave.songName && (
            <button
              type="button"
              onClick={handleDelete}
              style={{
                padding: "12px 25px",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: "none",
                fontSize: "14px",
                background: "#ff4444",
                color: "#fff",
              }}
            >
              Delete Pre-Save
            </button>
          )}
        </div>

        {status && <p className="admin-success">{status}</p>}
      </form>
    </div>
  );
}
