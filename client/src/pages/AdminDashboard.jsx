import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  sendNewsletter,
  fetchSubscribers,
  deleteSubscriber,
  restoreSubscribers,
  previewNewsletter,
  uploadNewsletterImage,
} from "../api/newsletter";
import { fetchPresave, updatePresave, deletePresave } from "../api/presave";
import { fetchSettings, updateSettings } from "../api/settings";
import promo from "../config/promo";
import "../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("newsletter"); // newsletter, subscribers, presave, promo
  const [epkLinkCopied, setEpkLinkCopied] = useState(false);
  const [recipients, setRecipients] = useState([]); // subscribers hand-picked in the Subscribers tab
  const [lastDeleted, setLastDeleted] = useState([]); // kept so a delete can be undone, even after switching tabs
  const epkUrl = `${window.location.origin}/epk-0a02faa10e`;

  // Redirect if not logged in
  if (!user) {
    navigate("/admin/login");
    return null;
  }

  const handleCopyEpkLink = () => {
    navigator.clipboard.writeText(epkUrl);
    setEpkLinkCopied(true);
    setTimeout(() => setEpkLinkCopied(false), 2000);
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-header-actions">
          <span className="admin-user">Welcome, {user.email}</span>
          <button onClick={logout} className="admin-logout-btn">Logout</button>
        </div>
      </div>

      {/* Private EPK Link */}
      <div className="admin-epk-link">
        <span className="admin-epk-link-label">Private EPK Link (share with bookers):</span>
        <div className="admin-epk-link-row">
          <input
            type="text"
            readOnly
            value={epkUrl}
            onFocus={(e) => e.target.select()}
            className="admin-epk-link-input"
          />
          <button onClick={handleCopyEpkLink} className="admin-btn-secondary">
            {epkLinkCopied ? "Copied!" : "Copy"}
          </button>
          <a
            href={epkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="admin-btn-secondary admin-epk-link-open"
          >
            Open
          </a>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === "newsletter" ? "active" : ""}`}
          onClick={() => setActiveTab("newsletter")}
        >
          Newsletter
        </button>
        <button
          className={`admin-tab ${activeTab === "subscribers" ? "active" : ""}`}
          onClick={() => setActiveTab("subscribers")}
        >
          Subscribers
        </button>
        <button
          className={`admin-tab ${activeTab === "presave" ? "active" : ""}`}
          onClick={() => setActiveTab("presave")}
        >
          Pre-Save
        </button>
        <button
          className={`admin-tab ${activeTab === "promo" ? "active" : ""}`}
          onClick={() => setActiveTab("promo")}
        >
          Pop-up
        </button>
      </div>

      {/* Tab Content */}
      <div className="admin-content">
        {activeTab === "newsletter" && (
          <NewsletterManagement
            recipients={recipients}
            onClearRecipients={() => setRecipients([])}
            onEditRecipients={() => setActiveTab("subscribers")}
          />
        )}
        {activeTab === "subscribers" && (
          <SubscriberList
            initialSelectedIds={recipients.map((r) => r._id)}
            onEmail={(chosen) => {
              setRecipients(chosen);
              setActiveTab("newsletter");
            }}
            lastDeleted={lastDeleted}
            onDeleted={(removed) => {
              const ids = removed.map((r) => r._id);
              setRecipients((list) => list.filter((r) => !ids.includes(r._id)));
              setLastDeleted(removed);
            }}
            onUndone={() => setLastDeleted([])}
          />
        )}
        {activeTab === "presave" && <PresaveManagement />}
        {activeTab === "promo" && <PromoManagement />}
      </div>
    </div>
  );
}

// Newsletter Management Component
const MAX_NEWSLETTER_IMAGES = 3;
const EMPTY_NEWSLETTER = { subject: "", message: "", sendTo: "all", images: [] };

function NewsletterManagement({ recipients, onClearRecipients, onEditRecipients }) {
  const [newsletter, setNewsletter] = useState(EMPTY_NEWSLETTER);
  const [sendStatus, setSendStatus] = useState("");
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewHeight, setPreviewHeight] = useState(600);
  const fileInputRef = useRef(null);

  // Messages that need acting on (like who didn't get an email) stay until the next send
  const statusTimer = useRef(null);
  const showStatus = (text, { sticky = false } = {}) => {
    clearTimeout(statusTimer.current);
    setSendStatus(text);
    if (!sticky) statusTimer.current = setTimeout(() => setSendStatus(""), 5000);
  };

  // Re-render the preview shortly after typing stops
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const html = await previewNewsletter({ message: newsletter.message, images: newsletter.images });
        if (!cancelled) setPreviewHtml(html);
      } catch (error) {
        console.error("Failed to load preview:", error);
      }
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [newsletter.message, newsletter.images]);

  const handleAddImages = async (e) => {
    const room = MAX_NEWSLETTER_IMAGES - newsletter.images.length;
    const files = Array.from(e.target.files || []).slice(0, room);
    e.target.value = "";
    if (files.length === 0) return;

    setUploading(true);
    try {
      const urls = [];
      for (const file of files) {
        urls.push(await uploadNewsletterImage(file));
      }
      setNewsletter((n) => ({ ...n, images: [...n.images, ...urls].slice(0, MAX_NEWSLETTER_IMAGES) }));
    } catch (error) {
      console.error("Failed to upload photo:", error);
      showStatus(error.response?.data?.error || "Failed to upload photo. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (url) => {
    setNewsletter((n) => ({ ...n, images: n.images.filter((u) => u !== url) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSendStatus("");
    setSending(true);

    try {
      const payload = {
        subject: newsletter.subject,
        message: newsletter.message,
        images: newsletter.images,
        ...(recipients.length ? { recipientIds: recipients.map((r) => r._id) } : { segment: newsletter.sendTo }),
      };

      const result = await sendNewsletter(payload);
      showStatus(result.message || `Newsletter sent successfully to ${result.count || 0} subscribers!`, {
        sticky: Boolean(result.failed?.length),
      });
      setNewsletter(EMPTY_NEWSLETTER);
      if (recipients.length) onClearRecipients();
    } catch (error) {
      console.error("Failed to send newsletter:", error);
      showStatus(error.response?.data?.error || "Failed to send newsletter. Please check your email configuration and try again.", {
        sticky: true,
      });
    } finally {
      setSending(false);
    }
  };

  const imagesFull = newsletter.images.length >= MAX_NEWSLETTER_IMAGES;

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>Newsletter</h2>
      </div>
      <p className="admin-hint">
        Send email updates to your mailing list. Subscribers can choose to receive updates about music, merch, shows, or all three.
        To email one person, click their address in the Subscribers tab. To email a custom group, tick the people
        you want there and press "Email selected".
      </p>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="admin-form-group">
          <label>Send To</label>
          {recipients.length ? (
            <div className="admin-recipient">
              {recipients.length === 1 ? (
                <span>
                  Just <strong>{recipients[0].email}</strong>
                </span>
              ) : (
                <div className="admin-recipient-list">
                  <span>
                    <strong>{recipients.length} selected subscribers</strong>
                  </span>
                  <ul>
                    {recipients.map((r) => (
                      <li key={r._id}>{r.email}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="admin-recipient-actions">
                <button type="button" className="admin-btn-secondary" onClick={onEditRecipients}>
                  Change who
                </button>
                <button type="button" className="admin-btn-secondary" onClick={onClearRecipients}>
                  Send to a group instead
                </button>
              </div>
            </div>
          ) : (
            <select
              value={newsletter.sendTo}
              onChange={(e) => setNewsletter({ ...newsletter, sendTo: e.target.value })}
            >
              <option value="all">All Subscribers</option>
              <option value="music">Music Subscribers</option>
              <option value="merch">Merch Subscribers</option>
              <option value="shows">Show Subscribers</option>
            </select>
          )}
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
          <small>Leave a blank line between paragraphs.</small>
        </div>

        <div className="admin-form-group">
          <label>Photos ({newsletter.images.length}/{MAX_NEWSLETTER_IMAGES})</label>
          {newsletter.images.length > 0 && (
            <div className="admin-newsletter-images">
              {newsletter.images.map((url) => (
                <div key={url} className="admin-newsletter-image">
                  <img src={url} alt="" />
                  <button type="button" onClick={() => handleRemoveImage(url)} aria-label="Remove photo">
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleAddImages}
            style={{ display: "none" }}
          />
          <button
            type="button"
            className="admin-btn-secondary"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || imagesFull}
          >
            {uploading ? "Uploading..." : imagesFull ? "3 photos max" : "Add Photos"}
          </button>
          <small>One photo shows centered. Two or three show side by side.</small>
        </div>

        <button type="submit" className="admin-btn-primary" disabled={sending || uploading}>
          {sending
            ? "Sending..."
            : recipients.length === 1
              ? `Send to ${recipients[0].email}`
              : recipients.length
                ? `Send to ${recipients.length} selected`
                : "Send Newsletter"}
        </button>

        {sendStatus && <p className="admin-success">{sendStatus}</p>}
      </form>

      <div className="admin-newsletter-preview">
        <h3>Preview</h3>
        {previewHtml ? (
          <iframe
            title="Email preview"
            srcDoc={previewHtml}
            sandbox="allow-same-origin"
            style={{ height: previewHeight }}
            onLoad={(e) => {
              const doc = e.target.contentDocument;
              if (doc) setPreviewHeight(doc.documentElement.scrollHeight);
            }}
          />
        ) : (
          <p style={{ color: "#888" }}>Loading preview...</p>
        )}
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

// Promo Pop-up Management Component
function PromoManagement() {
  const [enabled, setEnabled] = useState(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchSettings();
        setEnabled(data.promoEnabled);
      } catch (error) {
        console.error("Failed to load settings:", error);
        setStatus("Couldn't load the pop-up setting. Please refresh and try again.");
      }
    })();
  }, []);

  const handleToggle = async () => {
    setSaving(true);
    setStatus("");
    try {
      const data = await updateSettings({ promoEnabled: !enabled });
      setEnabled(data.promoEnabled);
      setStatus(data.promoEnabled ? "Pop-up turned on." : "Pop-up turned off.");
    } catch (error) {
      console.error("Failed to update settings:", error);
      setStatus("Failed to update the pop-up. Please try again.");
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(""), 5000);
    }
  };

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>Promo Pop-up</h2>
      </div>
      <p className="admin-hint">
        The pop-up shows visitors the current promo when they first open the site.
        {promo ? <> Current promo: <strong>{promo.title}</strong>.</> : " No promo is set up in the code right now."}
      </p>

      {enabled === null && !status && <p style={{ color: "#888" }}>Loading...</p>}

      {enabled !== null && (
        <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
          <span>
            Status: <strong style={{ color: enabled ? "#2e9e4f" : "#ff4444" }}>{enabled ? "On" : "Off"}</strong>
          </span>
          <button
            type="button"
            onClick={handleToggle}
            disabled={saving}
            className={enabled ? undefined : "admin-btn-primary"}
            style={enabled ? {
              padding: "12px 25px",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: saving ? "wait" : "pointer",
              border: "none",
              fontSize: "14px",
              background: "#ff4444",
              color: "#fff",
            } : undefined}
          >
            {saving ? "Saving..." : enabled ? "Disable Pop-up" : "Enable Pop-up"}
          </button>
        </div>
      )}

      {status && <p className="admin-success">{status}</p>}
    </div>
  );
}

// Mailing List Subscribers Component
const INTEREST_LABELS = { music: "Music", merch: "Merch", shows: "Shows" };
const ALL_INTERESTS = Object.keys(INTEREST_LABELS);

const sortNewestFirst = (list) =>
  [...list].sort((a, b) => new Date(b.subscribedAt || b.createdAt) - new Date(a.subscribedAt || a.createdAt));

function SubscriberList({ initialSelectedIds, lastDeleted, onEmail, onDeleted, onUndone }) {
  const [subscribers, setSubscribers] = useState([]);
  const [selected, setSelected] = useState(() => new Set(initialSelectedIds));
  const [deleting, setDeleting] = useState(false);
  const [undoing, setUndoing] = useState(false);
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState("all"); // all (everyone), music, merch, shows
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setSubscribers(await fetchSubscribers());
      } catch (err) {
        console.error("Failed to load subscribers:", err);
        setError("Couldn't load subscribers. Please refresh and try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Someone who picked every option, or whose categories weren't recorded, is in "all"
  // (matches how the newsletter treats them)
  const categoriesOf = (s) => {
    const interests = s.interests || [];
    if (interests.length === 0 || ALL_INTERESTS.every((i) => interests.includes(i))) return ["all"];
    return interests;
  };
  // "all" shows the whole list; a category shows people who chose just that one
  const matches = (s, key) => key === "all" || categoriesOf(s).includes(key);
  const countFor = (key) => subscribers.filter((s) => matches(s, key)).length;
  const visible = subscribers.filter((s) => matches(s, filter));

  // Ticking works across filters: picking from "Music" then "Shows" keeps both
  const selectedSubscribers = subscribers.filter((s) => selected.has(s._id));
  const allVisibleSelected = visible.length > 0 && visible.every((s) => selected.has(s._id));

  const toggle = (id) =>
    setSelected((set) => {
      const next = new Set(set);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleAllVisible = () =>
    setSelected((set) => {
      const next = new Set(set);
      visible.forEach((s) => (allVisibleSelected ? next.delete(s._id) : next.add(s._id)));
      return next;
    });

  const handleDelete = async (list) => {
    const question =
      list.length === 1
        ? `Delete ${list[0].email}? They'll stop getting emails.`
        : `Delete these ${list.length} subscribers? They'll stop getting emails.`;
    if (!window.confirm(question)) return;

    setDeleting(true);
    setNotice("");
    const results = await Promise.allSettled(list.map((s) => deleteSubscriber(s._id)));
    // A 404 means they were already gone (e.g. they unsubscribed themselves), which is fine
    const removed = list.filter((s, i) => results[i].status === "fulfilled" || results[i].reason?.response?.status === 404);
    const removedIds = removed.map((s) => s._id);
    const failed = list.filter((s) => !removedIds.includes(s._id));

    setSubscribers((all) => all.filter((s) => !removedIds.includes(s._id)));
    setSelected((set) => new Set([...set].filter((id) => !removedIds.includes(id))));
    onDeleted(removed);
    setNotice(failed.length ? `Couldn't delete ${failed.map((s) => s.email).join(", ")}. Please try again.` : "");
    setDeleting(false);
  };

  const handleUndo = async () => {
    setUndoing(true);
    setNotice("");
    try {
      const { restored, skipped } = await restoreSubscribers(lastDeleted);
      setSubscribers((all) => sortNewestFirst([...all.filter((s) => !restored.some((r) => r._id === s._id)), ...restored]));
      onUndone();
      setNotice(
        skipped.length
          ? `Restored ${restored.length}. Already on the list: ${skipped.join(", ")}.`
          : restored.length === 1
            ? `Restored ${restored[0].email}.`
            : `Restored ${restored.length} subscribers.`
      );
    } catch (err) {
      console.error("Failed to undo delete:", err);
      setNotice("Couldn't undo. Please try again.");
    } finally {
      setUndoing(false);
    }
  };

  const filters = [
    { key: "all", label: "All" },
    { key: "music", label: "Music" },
    { key: "merch", label: "Merch" },
    { key: "shows", label: "Shows" },
  ];

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
        <h2>Subscribers ({subscribers.length})</h2>
      </div>
      <p className="admin-hint">
        Everyone signed up for the mailing list and the updates they chose. People tagged
        <strong> All</strong> chose every update or signed up before categories were saved, and
        they get every newsletter. Click an email address to send a message to just that person, or tick
        several people to email them as a group or delete them.
      </p>

      {error && <p className="admin-success">{error}</p>}
      {lastDeleted.length > 0 && (
        <div className="admin-undo-bar" role="status">
          <span>
            {lastDeleted.length === 1 ? (
              <>
                Deleted <strong>{lastDeleted[0].email}</strong>.
              </>
            ) : (
              <>
                Deleted <strong>{lastDeleted.length} subscribers</strong>.
              </>
            )}
          </span>
          <button type="button" className="admin-btn-secondary" onClick={handleUndo} disabled={undoing}>
            {undoing ? "Undoing..." : "Undo"}
          </button>
        </div>
      )}
      {notice && <p className="admin-success" role="status">{notice}</p>}

      {selected.size > 0 && (
        <div className="admin-selection-bar">
          <span>
            <strong>{selected.size}</strong> selected
          </span>
          <div className="admin-selection-actions">
            <button type="button" className="admin-btn-primary" onClick={() => onEmail(selectedSubscribers)}>
              Email selected
            </button>
            <button
              type="button"
              className="admin-btn-danger"
              onClick={() => handleDelete(selectedSubscribers)}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete selected"}
            </button>
            <button type="button" className="admin-btn-secondary" onClick={() => setSelected(new Set())}>
              Clear
            </button>
          </div>
        </div>
      )}

      <div className="admin-subscriber-filters">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            className={`admin-subscriber-filter ${filter === key ? "active" : ""}`}
            onClick={() => setFilter(key)}
          >
            {label} ({countFor(key)})
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p style={{ color: "#888" }}>No subscribers in this category yet.</p>
      ) : (
        <div className="admin-subscriber-table-wrap">
          <table className="admin-subscriber-table">
            <thead>
              <tr>
                <th className="admin-subscriber-check">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={toggleAllVisible}
                    aria-label={allVisibleSelected ? "Unselect everyone shown" : "Select everyone shown"}
                  />
                </th>
                <th>Email</th>
                <th>Categories</th>
                <th className="admin-subscriber-date">Signed up</th>
                <th>
                  <span className="sr-only">Delete</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((s) => (
                <tr key={s._id} className={selected.has(s._id) ? "selected" : ""}>
                  <td className="admin-subscriber-check">
                    <input
                      type="checkbox"
                      checked={selected.has(s._id)}
                      onChange={() => toggle(s._id)}
                      aria-label={`Select ${s.email}`}
                    />
                  </td>
                  <td className="admin-subscriber-email-cell">
                    <button
                      type="button"
                      className="admin-subscriber-email"
                      onClick={() => onEmail([s])}
                      title={`Email ${s.email}`}
                    >
                      {s.email}
                    </button>
                  </td>
                  <td>
                    {categoriesOf(s).map((c) => (
                      <span key={c} className="admin-subscriber-tag">
                        {c === "all" ? "All" : INTEREST_LABELS[c] || c}
                      </span>
                    ))}
                  </td>
                  <td className="admin-subscriber-date">
                    {new Date(s.subscribedAt || s.createdAt).toLocaleDateString()}
                  </td>
                  <td className="admin-subscriber-delete-cell">
                    <button
                      type="button"
                      className="admin-subscriber-delete"
                      onClick={() => handleDelete([s])}
                      disabled={deleting}
                      aria-label={`Delete ${s.email}`}
                      title={`Delete ${s.email}`}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
