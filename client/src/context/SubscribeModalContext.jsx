import { createContext, useContext, useState } from "react";
import { subscribe } from "../api/newsletter";
import "../styles/ContactCard.css";

const SubscribeModalContext = createContext();

export const useSubscribeModal = () => {
  const context = useContext(SubscribeModalContext);
  if (!context) {
    throw new Error("useSubscribeModal must be used within SubscribeModalProvider");
  }
  return context;
};

export const SubscribeModalProvider = ({ children }) => {
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribeOptions, setSubscribeOptions] = useState({
    music: false,
    merch: false,
    shows: false,
  });
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);

  const openSubscribeModal = () => {
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
    <SubscribeModalContext.Provider value={{ openSubscribeModal }}>
      {children}

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
    </SubscribeModalContext.Provider>
  );
};
