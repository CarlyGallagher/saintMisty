import { useState, useEffect } from "react";
import profileImg from "../assets/SaintMistyProfileImg.jpeg";
import { fetchShows } from "../api/shows";
import { useSubscribeModal } from "../context/SubscribeModalContext";
import "../styles/Shows.css";

export default function Shows() {
  const { openSubscribeModal } = useSubscribeModal();
  const [upcomingShows, setUpcomingShows] = useState([]);

  // Fetch shows from backend
  useEffect(() => {
    (async () => {
      try {
        const shows = await fetchShows();
        setUpcomingShows(shows);
      } catch (error) {
        console.error("Failed to fetch shows:", error);
      }
    })();
  }, []);

  return (
    <div className="shows-container">
      {/* Header */}
      <div className="shows-header">
        <img
          src="https://www.gigaglitters.com/created/LZFycy67hT.gif"
          alt="Upcoming Shows - Glitter Graphics"
          className="shows-header-gif"
        />
      </div>

      {/* Subscribe Card */}
      <div className="subscribe-card">
        <div className="subscribe-card-content">
          <img src={profileImg} alt="Saint Misty" className="subscribe-image" />
          <div className="subscribe-text">
            <h2>Saint Misty</h2>
            <p>Get updates on new shows, music, and more.</p>
            <button className="subscribe-button" onClick={openSubscribeModal}>
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
                  {show.ticketUrl ? (
                    <a
                      href={show.ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tickets-button"
                    >
                      TICKETS
                    </a>
                  ) : show.bandsintownUrl ? (
                    <a
                      href={`${show.bandsintownUrl}&trigger=notify_me`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tickets-button"
                    >
                      NOTIFY ME
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
