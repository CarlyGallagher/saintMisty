import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { sendNewsletter } from "../api/newsletter";
import { fetchPresave, updatePresave, deletePresave } from "../api/presave";
import { fetchMedia, createMedia, deleteMedia } from "../api/media";
import { mediaAssetsMap } from "../utils/mediaAssets";
import "../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("blog"); // blog, newsletter, presave, media

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
        <button
          className={`admin-tab ${activeTab === "media" ? "active" : ""}`}
          onClick={() => setActiveTab("media")}
        >
          Photos
        </button>
      </div>

      {/* Tab Content */}
      <div className="admin-content">
        {activeTab === "blog" && <BlogManagement />}
        {activeTab === "newsletter" && <NewsletterManagement />}
        {activeTab === "presave" && <PresaveManagement />}
        {activeTab === "media" && <MediaManagement />}
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

// Media Management Component
function MediaManagement() {
  const [mediaItems, setMediaItems] = useState([]);
  const [form, setForm] = useState({ title: "", url: "", date: "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const availableAssets = Object.keys(mediaAssetsMap).filter(
    (key) => !key.includes("ProfileImg") && !key.includes("Montegue")
  );

  useEffect(() => {
    fetchMedia()
      .then((items) => setMediaItems(items.filter((m) => m.type === "photo")))
      .catch(() => setStatus("Failed to load photos."))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      const newItem = await createMedia({
        title: form.title,
        type: "photo",
        url: form.url,
        date: form.date || new Date(),
      });
      setMediaItems((prev) => [newItem, ...prev]);
      setForm({ title: "", url: "", date: "" });
      setStatus("Photo added!");
      setTimeout(() => setStatus(""), 4000);
    } catch {
      setStatus("Failed to add photo.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this photo?")) return;
    try {
      await deleteMedia(id);
      setMediaItems((prev) => prev.filter((m) => m._id !== id));
    } catch {
      setStatus("Failed to delete photo.");
    }
  };

  if (loading) return <div className="admin-section"><p style={{ color: "#888" }}>Loading...</p></div>;

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>Photos</h2>
      </div>
      <p className="admin-hint">Add or remove photos from the Photos & Videos page.</p>

      <form onSubmit={handleAdd} className="admin-form" style={{ marginBottom: "32px" }}>
        <div className="admin-form-group">
          <label>Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g., Ken Club Show"
            required
          />
        </div>
        <div className="admin-form-group">
          <label>Photo</label>
          <select
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            required
          >
            <option value="">Select a photo...</option>
            {availableAssets.map((key) => (
              <option key={key} value={key}>
                {key.replace("/static/media/", "")}
              </option>
            ))}
          </select>
        </div>
        <div className="admin-form-group">
          <label>Date (optional)</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>
        <button type="submit" className="admin-btn-primary">+ Add Photo</button>
        {status && <p className="admin-success">{status}</p>}
      </form>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {mediaItems.length === 0 && <p style={{ color: "#888" }}>No photos yet.</p>}
        {mediaItems.map((item) => (
          <div key={item._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#1a1a1a", padding: "12px 16px", borderRadius: "8px" }}>
            <span style={{ color: "#fff" }}>{item.title}</span>
            <button
              onClick={() => handleDelete(item._id)}
              style={{ background: "#ff4444", color: "#fff", border: "none", borderRadius: "6px", padding: "6px 14px", cursor: "pointer", fontWeight: "bold" }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
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
