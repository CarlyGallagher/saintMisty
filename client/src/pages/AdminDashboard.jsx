import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { createMedia, uploadMediaFile, fetchMedia, deleteMedia } from "../api/media";
import { createShow, fetchShows, deleteShow } from "../api/shows";
import { sendNewsletter } from "../api/newsletter";
import "../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("blog"); // blog, media, shows, newsletter

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
          className={`admin-tab ${activeTab === "media" ? "active" : ""}`}
          onClick={() => setActiveTab("media")}
        >
          Photos & Videos
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
        {activeTab === "media" && <MediaManagement />}
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

// Media Management Component
function MediaManagement() {
  const [mediaType, setMediaType] = useState("photo");
  const [uploadMode, setUploadMode] = useState("file"); // "file" or "url"
  const [mediaForm, setMediaForm] = useState({
    title: "",
    url: "",
    videoUrl: "",
    date: new Date().toISOString().split('T')[0]
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      const media = await fetchMedia();
      setMediaList(media);
    } catch (error) {
      console.error("Failed to fetch media:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this media item?")) {
      return;
    }

    try {
      await deleteMedia(id);
      setUploadStatus("Media deleted successfully!");
      loadMedia(); // Reload the list
      setTimeout(() => setUploadStatus(""), 3000);
    } catch (error) {
      console.error("Failed to delete media:", error);
      setUploadStatus("Failed to delete media. Please try again.");
      setTimeout(() => setUploadStatus(""), 3000);
    }
  };

  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    const validVideoTypes = ['video/mp4', 'video/mov', 'video/avi'];

    const isValidImage = validImageTypes.includes(file.type);
    const isValidVideo = validVideoTypes.includes(file.type);

    if (mediaType === "photo" && !isValidImage) {
      setUploadStatus("Please select a valid image file (JPG, PNG, GIF)");
      setTimeout(() => setUploadStatus(""), 3000);
      return;
    }

    if (mediaType === "video" && !isValidVideo) {
      setUploadStatus("Please select a valid video file (MP4, MOV, AVI)");
      setTimeout(() => setUploadStatus(""), 3000);
      return;
    }

    setSelectedFile(file);

    // Create preview for images
    if (mediaType === "photo" && isValidImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl("");
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadStatus("");

    try {
      if (uploadMode === "file") {
        // File upload
        if (!selectedFile) {
          setUploadStatus("Please select a file to upload");
          setTimeout(() => setUploadStatus(""), 3000);
          return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("title", mediaForm.title);
        formData.append("type", mediaType);
        formData.append("date", mediaForm.date);
        if (mediaType === "video" && mediaForm.videoUrl) {
          formData.append("videoUrl", mediaForm.videoUrl);
        }

        await uploadMediaFile(formData);
        setUploadStatus("Media uploaded successfully!");
      } else {
        // URL upload
        const payload = {
          type: mediaType,
          title: mediaForm.title,
          url: mediaType === "photo" ? mediaForm.url : mediaForm.url,
          thumbnail: mediaType === "video" ? mediaForm.url : undefined,
          videoUrl: mediaType === "video" ? mediaForm.videoUrl : undefined,
          date: mediaForm.date
        };

        await createMedia(payload);
        setUploadStatus("Media added successfully!");
      }

      // Reset form
      setMediaForm({
        title: "",
        url: "",
        videoUrl: "",
        date: new Date().toISOString().split('T')[0]
      });
      setSelectedFile(null);
      setPreviewUrl("");

      // Reload media list
      loadMedia();

      setTimeout(() => setUploadStatus(""), 3000);
    } catch (error) {
      console.error("Failed to add media:", error);
      setUploadStatus("Failed to add media. Please try again.");
      setTimeout(() => setUploadStatus(""), 3000);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>Photos & Videos</h2>
      </div>
      <p className="admin-hint">
        Add photos and videos to the Pictures & Videos page. These will appear in the gallery for fans to view.
      </p>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="admin-form-group">
          <label>Media Type</label>
          <div className="admin-radio-group">
            <label>
              <input
                type="radio"
                value="photo"
                checked={mediaType === "photo"}
                onChange={(e) => setMediaType(e.target.value)}
              />
              Photo
            </label>
            <label>
              <input
                type="radio"
                value="video"
                checked={mediaType === "video"}
                onChange={(e) => setMediaType(e.target.value)}
              />
              Video
            </label>
          </div>
        </div>

        <div className="admin-form-group">
          <label>Upload Method</label>
          <div className="admin-radio-group">
            <label>
              <input
                type="radio"
                value="file"
                checked={uploadMode === "file"}
                onChange={(e) => setUploadMode(e.target.value)}
              />
              Upload File
            </label>
            <label>
              <input
                type="radio"
                value="url"
                checked={uploadMode === "url"}
                onChange={(e) => setUploadMode(e.target.value)}
              />
              Use URL
            </label>
          </div>
        </div>

        <div className="admin-form-group">
          <label>Title</label>
          <input
            type="text"
            value={mediaForm.title}
            onChange={(e) => setMediaForm({ ...mediaForm, title: e.target.value })}
            placeholder="e.g., Studio Session, Concert Night"
            required
          />
        </div>

        {uploadMode === "file" ? (
          <>
            <div className="admin-form-group">
              <label>Upload {mediaType === "photo" ? "Photo" : "Video"}</label>
              <div
                className={`file-drop-zone ${dragActive ? "drag-active" : ""}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById("fileInput").click()}
              >
                {selectedFile ? (
                  <div className="file-selected">
                    {previewUrl && <img src={previewUrl} alt="Preview" className="file-preview" />}
                    <p>{selectedFile.name}</p>
                    <p className="file-size">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div className="file-drop-text">
                    <p>📁 Drag and drop {mediaType === "photo" ? "a photo" : "a video"} here</p>
                    <p>or click to browse</p>
                    <small>Max file size: 10MB</small>
                  </div>
                )}
              </div>
              <input
                id="fileInput"
                type="file"
                accept={mediaType === "photo" ? "image/jpeg,image/png,image/gif" : "video/mp4,video/mov,video/avi"}
                onChange={handleFileInputChange}
                style={{ display: "none" }}
              />
            </div>

            {mediaType === "video" && (
              <div className="admin-form-group">
                <label>Video URL (Optional - for YouTube embeds)</label>
                <input
                  type="url"
                  value={mediaForm.videoUrl}
                  onChange={(e) => setMediaForm({ ...mediaForm, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/embed/VIDEO_ID"
                />
                <small>If you want to use a YouTube video instead of uploaded file</small>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="admin-form-group">
              <label>{mediaType === "photo" ? "Photo URL" : "Thumbnail URL"}</label>
              <input
                type="url"
                value={mediaForm.url}
                onChange={(e) => setMediaForm({ ...mediaForm, url: e.target.value })}
                placeholder="https://example.com/image.jpg"
                required
              />
              <small>Upload to a service like Imgur or use a direct image URL</small>
            </div>

            {mediaType === "video" && (
              <div className="admin-form-group">
                <label>Video URL (YouTube Embed)</label>
                <input
                  type="url"
                  value={mediaForm.videoUrl}
                  onChange={(e) => setMediaForm({ ...mediaForm, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/embed/VIDEO_ID"
                  required
                />
                <small>Use YouTube embed URL format</small>
              </div>
            )}
          </>
        )}

        <div className="admin-form-group">
          <label>Date</label>
          <input
            type="date"
            value={mediaForm.date}
            onChange={(e) => setMediaForm({ ...mediaForm, date: e.target.value })}
            required
          />
        </div>

        <button type="submit" className="admin-btn-primary">
          {uploadMode === "file" ? "Upload" : "Add"} {mediaType === "photo" ? "Photo" : "Video"}
        </button>

        {uploadStatus && <p className="admin-success">{uploadStatus}</p>}
      </form>

      {/* Existing Media List */}
      <div style={{ marginTop: 40 }}>
        <h3 style={{ color: "#ff69b4", marginBottom: 20 }}>Existing Media</h3>
        {loading ? (
          <p style={{ color: "#888" }}>Loading media...</p>
        ) : mediaList.length === 0 ? (
          <p style={{ color: "#888" }}>No media items yet. Add one above!</p>
        ) : (
          <div className="media-list-grid">
            {mediaList.map((item) => (
              <div key={item._id} className="media-list-item">
                {item.type === "photo" ? (
                  <img src={item.url} alt={item.title} className="media-list-thumbnail" />
                ) : (
                  <div className="media-list-video">
                    {item.thumbnail && <img src={item.thumbnail} alt={item.title} className="media-list-thumbnail" />}
                    <div className="video-icon">▶</div>
                  </div>
                )}
                <div className="media-list-info">
                  <h4>{item.title}</h4>
                  <p className="media-list-type">{item.type === "photo" ? "📷 Photo" : "🎥 Video"}</p>
                  <p className="media-list-date">{new Date(item.date).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="media-delete-btn"
                  title="Delete this media"
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
