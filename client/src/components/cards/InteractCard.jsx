import { useState } from "react";

export default function InteractCard() {
  const [copied, setCopied] = useState(false);

  const handleSendMessage = () => {
    window.location.href = "mailto:saintmisty@gmail.com";
  };

  const handleForward = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddToFavorites = () => {
    if (window.sidebar && window.sidebar.addPanel) {
      window.sidebar.addPanel(document.title, window.location.href, "");
    } else if (window.external && window.external.AddFavorite) {
      window.external.AddFavorite(window.location.href, document.title);
    } else {
      alert("Press Ctrl+D (Cmd+D on Mac) to bookmark this page!");
    }
  };

  return (
    <div className="y2k-card">
      <div className="y2k-card-header">Interact</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <button className="y2k-button" onClick={handleSendMessage}>
          Send Message
        </button>
        <button className="y2k-button-secondary y2k-button" onClick={handleForward}>
          {copied ? "Link Copied!" : "Forward to Friend"}
        </button>
        <button className="y2k-button-secondary y2k-button" onClick={handleAddToFavorites}>
          Add to Favorites
        </button>
      </div>
    </div>
  );
}
