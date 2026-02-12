import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchShows } from "../../api/shows";
import { useAccessibility } from "../../context/AccessibilityContext";
import "../../styles/Shows.css";

export default function ShowCard() {
  const { highContrast } = useAccessibility();

  const [nextShow, setNextShow] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const shows = await fetchShows();
        if (shows.length > 0) {
          setNextShow(shows[0]);
        }
      } catch (error) {
        console.error("Failed to fetch shows:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="y2k-card" style={{ background: "transparent" }}>
        <Link to="/shows" style={{ display: "block", textAlign: "center", marginBottom: "2px" }}>
          {highContrast ? (
            <div className="y2k-card-header">Upcoming Shows</div>
          ) : (
            <img
              src="http://www.gigaglitters.com/created/LZFycy67hT.gif"
              alt="Upcoming Shows - Glitter Graphics"
              style={{ maxWidth: "100%", height: "auto", width: "600px" }}
            />
          )}
        </Link>
        <p style={{ fontSize: "13px", textAlign: "center" }}>Loading...</p>
      </div>
    );
  }

  if (!nextShow) {
    return (
      <div className="y2k-card" style={{ background: "transparent" }}>
        <Link to="/shows" style={{ display: "block", textAlign: "center", marginBottom: "8px" }}>
          {highContrast ? (
            <div className="y2k-card-header">Upcoming Shows</div>
          ) : (
            <img
              src="http://www.gigaglitters.com/created/LZFycy67hT.gif"
              alt="Upcoming Shows - Glitter Graphics"
              style={{ maxWidth: "100%", height: "auto", width: "600px" }}
            />
          )}
        </Link>
        <p style={{ fontSize: "13px", textAlign: "center" }}>No upcoming shows at this time.</p>
      </div>
    );
  }

  return (
    <div className="y2k-card" style={{ background: "transparent", padding: "16px" }}>
      <Link to="/shows" style={{ display: "block", textAlign: "center", marginBottom: "12px" }}>
        {highContrast ? (
          <div className="y2k-card-header">Upcoming Shows</div>
        ) : (
          <img
            src="http://www.gigaglitters.com/created/LZFycy67hT.gif"
            alt="Upcoming Shows - Glitter Graphics"
            style={{ maxWidth: "100%", height: "auto", width: "600px" }}
          />
        )}
      </Link>
      <div className="show-item" style={{ marginBottom: 0 }}>
        <div>
          <div className="show-info">
            <div className="show-date-time">
              <span className="show-date">{nextShow.date}</span>
              <span className="show-divider">|</span>
              <span className="show-time">{nextShow.time}</span>
            </div>
            <div className="show-location">
              <span className="show-city">{nextShow.city}</span>
            </div>
            <div className="show-venue">{nextShow.venue}</div>
          </div>
          <div className="show-actions">
            {nextShow.ticketUrl ? (
              <a
                href={nextShow.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="tickets-button"
              >
                TICKETS
              </a>
            ) : nextShow.bandsintownUrl ? (
              <a
                href={`${nextShow.bandsintownUrl}&trigger=notify_me`}
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
    </div>
  );
}
