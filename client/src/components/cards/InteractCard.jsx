import { useState } from "react";
import { Link } from "react-router-dom";
import { subscribe } from "../../api/newsletter";
import "../../styles/Shows.css";
import "../../styles/ContactCard.css";

export default function InteractCard() {
  const [copied, setCopied] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribeOptions, setSubscribeOptions] = useState({
    music: false,
    merch: false,
    shows: false,
  });
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);

  const handleSendMessage = () => {
    window.location.href = "mailto:thesaintmisty@gmail.com";
  };

  const handleForward = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubscribeClick = () => {
    setShowSubscribeModal(true);
    setSubscribeSuccess(false);
  };

  const handleCloseModal = () => {
    setShowSubscribeModal(false);
    setEmail("");
    setSubscribeOptions({ music: false, merch: false, shows: false });
    setSubscribeSuccess(false);
  };

  const handleCheckboxChange = (option) => {
    setSubscribeOptions((prev) => ({ ...prev, [option]: !prev[option] }));
  };

  const handleSubmitSubscription = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }
    const hasSelection = Object.values(subscribeOptions).some((val) => val);
    if (!hasSelection) {
      alert("Please select at least one update option");
      return;
    }
    try {
      await subscribe({ email, name: "" });
      setSubscribeSuccess(true);
      setTimeout(() => handleCloseModal(), 2000);
    } catch (error) {
      console.error("Subscription failed:", error);
      alert("Failed to subscribe. Please try again.");
    }
  };

  return (
    <>
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
          <button className="contact-card-item" onClick={handleSubscribeClick}>
            <span className="contact-card-icon">★</span>
            <span>Subscribe</span>
          </button>
          <Link to="/pictures" className="contact-card-item">
            <span className="contact-card-icon">◈</span>
            <span>View Photos</span>
          </Link>
        </div>
      </div>

      {showSubscribeModal && (
        <div className="subscribe-modal-overlay" onClick={handleCloseModal}>
          <div className="subscribe-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>✕</button>
            {subscribeSuccess ? (
              <div className="subscribe-success">
                <h3>✓ Subscribed!</h3>
                <p>Thank you for subscribing to Saint Misty updates.</p>
              </div>
            ) : (
              <>
                <h3>Get Saint Misty Updates</h3>
                <p className="modal-subtitle">Choose what you'd like to hear about:</p>
                <form onSubmit={handleSubmitSubscription}>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input type="checkbox" checked={subscribeOptions.music} onChange={() => handleCheckboxChange("music")} />
                      <span>Music Releases</span>
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" checked={subscribeOptions.merch} onChange={() => handleCheckboxChange("merch")} />
                      <span>Merch & Shop Updates</span>
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" checked={subscribeOptions.shows} onChange={() => handleCheckboxChange("shows")} />
                      <span>Show Announcements</span>
                    </label>
                  </div>
                  <div className="email-input-group">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="email-input"
                      required
                    />
                  </div>
                  <button type="submit" className="modal-subscribe-button">Subscribe</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
