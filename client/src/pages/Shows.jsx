import { useState, useEffect } from "react";
import profileImg from "../assets/SaintMistyProfileImg.jpeg";
import { fetchShows } from "../api/shows";
import { subscribe } from "../api/newsletter";
import "../styles/Shows.css";

export default function Shows() {
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribeOptions, setSubscribeOptions] = useState({
    music: false,
    merch: false,
    shows: false,
  });
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [upcomingShows, setUpcomingShows] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch shows from backend
  useEffect(() => {
    (async () => {
      try {
        const shows = await fetchShows();
        setUpcomingShows(shows);
      } catch (error) {
        console.error("Failed to fetch shows:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
    setSubscribeOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  const handleSubmitSubscription = async (e) => {
    e.preventDefault();

    // Validate email
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }

    // Check if at least one option is selected
    const hasSelection = Object.values(subscribeOptions).some(val => val);
    if (!hasSelection) {
      alert("Please select at least one update option");
      return;
    }

    try {
      await subscribe({ email, name: "" });
      setSubscribeSuccess(true);

      // Auto-close after 2 seconds
      setTimeout(() => {
        handleCloseModal();
      }, 2000);
    } catch (error) {
      console.error("Subscription failed:", error);
      alert("Failed to subscribe. Please try again.");
    }
  };

  return (
    <div className="shows-container">
      {/* Header */}
      <div className="shows-header">
        <img src="http://www.gigaglitters.com/created/LZFycy67hT.gif" width="450" height="80" border="0" alt="http://www.rasaint.net/ - Glitter Graphics"></img>
      </div>

      {/* Subscribe Card */}
      <div className="subscribe-card">
        <div className="subscribe-card-content">
          <img src={profileImg} alt="Saint Misty" className="subscribe-image" />
          <div className="subscribe-text">
            <h2>Saint Misty</h2>
            <p>Get updates on new shows, music, and more.</p>
            <button className="subscribe-button" onClick={handleSubscribeClick}>
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Upcoming Shows */}
      <div className="shows-list">
        {upcomingShows.length === 0 ? (
          <p className="no-shows">No upcoming shows at this time. Check back soon!</p>
        ) : (
          upcomingShows.map((show) => (
            <div key={show.id} className="show-item">
              <div>
                <div className="show-info">
                  <div className="show-date-time">
                    <span className="show-date">{show.date}</span>
                    <span className="show-divider">|</span>
                    <span className="show-time">{show.time}</span>
                  </div>
                  <div className="show-location">
                    <span className="show-city">{show.city}</span>
                  </div>
                  <div className="show-venue">{show.venue}</div>
                </div>
                <div className="show-actions">
                  <a
                    href={show.ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tickets-button"
                  >
                    TICKETS
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Subscribe Modal */}
      {showSubscribeModal && (
        <div className="subscribe-modal-overlay" onClick={handleCloseModal}>
          <div className="subscribe-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>
              ✕
            </button>

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
                      <input
                        type="checkbox"
                        checked={subscribeOptions.music}
                        onChange={() => handleCheckboxChange("music")}
                      />
                      <span>Music Releases</span>
                    </label>

                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={subscribeOptions.merch}
                        onChange={() => handleCheckboxChange("merch")}
                      />
                      <span>Merch & Shop Updates</span>
                    </label>

                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={subscribeOptions.shows}
                        onChange={() => handleCheckboxChange("shows")}
                      />
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

                  <button type="submit" className="modal-subscribe-button">
                    Subscribe
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
