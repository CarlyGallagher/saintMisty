import { useState } from "react";
import { useSubscribeModal } from "../../context/SubscribeModalContext";
import "../../styles/Shows.css";
import "../../styles/ContactCard.css";

export default function InteractCard() {
  const [copied, setCopied] = useState(false);
  const { openSubscribeModal } = useSubscribeModal();

  const handleSendMessage = () => {
    window.location.href = "mailto:thesaintmisty@gmail.com";
  };

  const handleForward = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="y2k-card contact-card">
      <div className="contact-card-header">Interact</div>
      <div className="contact-card-grid">
        <button className="contact-card-item" onClick={handleSendMessage}>
          <span className="contact-card-icon">✉</span>
          <span>Send Message</span>
        </button>
        <button className="contact-card-item" onClick={handleForward}>
          <span className="contact-card-icon">↪</span>
          <span>{copied ? "Link Copied!" : "Forward to Friend"}</span>
        </button>
        <button className="contact-card-item" onClick={openSubscribeModal}>
          <span className="contact-card-icon">★</span>
          <span>Subscribe</span>
        </button>
        <a
          href="https://www.instagram.com/thesaintmisty"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-card-item"
        >
          <span className="contact-card-icon">◈</span>
          <span>View Photos</span>
        </a>
      </div>
    </div>
  );
}
