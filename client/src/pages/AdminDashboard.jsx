import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { sendNewsletter } from "../api/newsletter";
import { fetchPresave, updatePresave, deletePresave } from "../api/presave";
import { fetchMedia, updateMedia, deleteMedia, uploadMediaFile } from "../api/media";
import { getMediaUrl } from "../utils/mediaAssets";
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
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(null); // { file, objectUrl, title, type, date }
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", date: "" });

  useEffect(() => {
    fetchMedia()
      .then(setMediaItems)
      .catch(() => setStatus("Failed to load media."))
      .finally(() => setLoading(false));
  }, []);

  const handleFile = (file) => {
    if (!file) return;
    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");
    if (!isVideo && !isImage) return;
    setPreview({ file, objectUrl: URL.createObjectURL(file), title: "", type: isVideo ? "video" : "photo", date: "" });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!preview?.file || !preview.title) return;
    setUploading(true);
    setStatus("");
    try {
      const formData = new FormData();
      formData.append("file", preview.file);
      formData.append("title", preview.title);
      formData.append("type", preview.type);
      if (preview.date) formData.append("date", preview.date);
      const newItem = await uploadMediaFile(formData);
      setMediaItems((prev) => [newItem, ...prev]);
      URL.revokeObjectURL(preview.objectUrl);
      setPreview(null);
      setStatus("Uploaded successfully!");
      setTimeout(() => setStatus(""), 4000);
    } catch {
      setStatus("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleEditSave = async (id) => {
    try {
      const item = mediaItems.find((m) => m._id === id);
      const updated = await updateMedia(id, { ...item, title: editForm.title, date: editForm.date || item.date });
      setMediaItems((prev) => prev.map((m) => (m._id === id ? updated : m)));
      setEditingId(null);
      setStatus("Updated!");
      setTimeout(() => setStatus(""), 3000);
    } catch {
      setStatus("Failed to update.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item? This cannot be undone.")) return;
    try {
      await deleteMedia(id);
      setMediaItems((prev) => prev.filter((m) => m._id !== id));
    } catch {
      setStatus("Failed to delete.");
    }
  };

  if (loading) return <div className="admin-section"><p style={{ color: "#888" }}>Loading...</p></div>;

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>Photos & Videos</h2>
      </div>
      <p className="admin-hint">Upload photos or videos. They are stored permanently on Cloudinary.</p>

      {!preview ? (
        <label
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          style={{
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            border: `2px dashed ${dragging ? "#fff" : "#555"}`, borderRadius: "12px",
            padding: "48px 24px", cursor: "pointer", background: dragging ? "#1a1a1a" : "transparent",
            marginBottom: "24px", transition: "all 0.2s",
          }}
        >
          <span style={{ fontSize: "2rem", marginBottom: "8px" }}>📁</span>
          <span style={{ color: "#aaa" }}>Drag a photo or video here, or <span style={{ color: "#fff", textDecoration: "underline" }}>click to browse</span></span>
          <input type="file" accept="image/*,video/*" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
        </label>
      ) : (
        <form onSubmit={handleUpload} className="admin-form" style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", marginBottom: "16px" }}>
            {preview.type === "photo" ? (
              <img src={preview.objectUrl} alt="preview" style={{ width: "120px", height: "80px", objectFit: "cover", borderRadius: "8px", flexShrink: 0 }} />
            ) : (
              <video src={preview.objectUrl} style={{ width: "120px", height: "80px", objectFit: "cover", borderRadius: "8px", flexShrink: 0 }} muted />
            )}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label>Title</label>
                <input
                  type="text"
                  value={preview.title}
                  onChange={(e) => setPreview({ ...preview, title: e.target.value })}
                  placeholder="e.g., Ken Club Show"
                  required
                  autoFocus
                />
              </div>
              <div className="admin-form-group" style={{ margin: 0 }}>
                <label>Date (optional)</label>
                <input type="date" value={preview.date} onChange={(e) => setPreview({ ...preview, date: e.target.value })} />
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit" className="admin-btn-primary" disabled={uploading}>
              {uploading ? "Uploading..." : "Upload"}
            </button>
            <button
              type="button"
              onClick={() => { URL.revokeObjectURL(preview.objectUrl); setPreview(null); }}
              style={{ padding: "12px 20px", borderRadius: "8px", border: "1px solid #555", background: "transparent", color: "#aaa", cursor: "pointer", fontWeight: "bold" }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {status && <p className="admin-success" style={{ marginBottom: "16px" }}>{status}</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {mediaItems.length === 0 && <p style={{ color: "#888" }}>No media yet.</p>}
        {mediaItems.map((item) => (
          <div key={item._id} style={{ background: "#1a1a1a", borderRadius: "8px", overflow: "hidden" }}>
            {editingId === item._id ? (
              <div style={{ padding: "12px 16px", display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                <input
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  style={{ flex: 1, minWidth: "150px", padding: "6px 10px", borderRadius: "6px", border: "1px solid #555", background: "#111", color: "#fff" }}
                />
                <input
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                  style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid #555", background: "#111", color: "#fff" }}
                />
                <button onClick={() => handleEditSave(item._id)} className="admin-btn-primary" style={{ padding: "6px 14px" }}>Save</button>
                <button onClick={() => setEditingId(null)} style={{ padding: "6px 14px", borderRadius: "6px", border: "1px solid #555", background: "transparent", color: "#aaa", cursor: "pointer" }}>Cancel</button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px" }}>
                <img
                  src={getMediaUrl(item.thumbnail || item.url)}
                  alt={item.title}
                  style={{ width: "60px", height: "40px", objectFit: "cover", borderRadius: "4px", flexShrink: 0 }}
                />
                <div style={{ flex: 1 }}>
                  <span style={{ color: "#fff", fontWeight: "bold" }}>{item.title}</span>
                  <span style={{ color: "#888", fontSize: "12px", marginLeft: "10px" }}>{item.type}</span>
                </div>
                <button
                  onClick={() => { setEditingId(item._id); setEditForm({ title: item.title, date: item.date ? item.date.split("T")[0] : "" }); }}
                  style={{ background: "#444", color: "#fff", border: "none", borderRadius: "6px", padding: "6px 14px", cursor: "pointer", fontWeight: "bold" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  style={{ background: "#ff4444", color: "#fff", border: "none", borderRadius: "6px", padding: "6px 14px", cursor: "pointer", fontWeight: "bold" }}
                >
                  Delete
                </button>
              </div>
            )}
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
