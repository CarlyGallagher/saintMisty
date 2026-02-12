import { useState, useEffect } from "react";
import { fetchPresave } from "../../api/presave";
import { useAccessibility } from "../../context/AccessibilityContext";

export default function NetworkCard() {
  const { highContrast } = useAccessibility();
  const [presave, setPresave] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchPresave();
        setPresave(data);
      } catch (error) {
        // No pre-save configured, show fallback
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="y2k-card" style={{ background: "rgba(255, 255, 255, 0.8)" }}>
        <p style={{ fontSize: "13px", textAlign: "center", fontWeight: "bold" }}>
          Loading...
        </p>
      </div>
    );
  }

  if (!presave) {
    return (
      <div className="y2k-card" style={{ background: "rgba(255, 255, 255, 0.8)" }}>
        <p style={{ fontSize: "13px", textAlign: "center", fontWeight: "bold" }}>
          Saint Misty is in your{" "}
          <span style={{ color: "#FF0000" }}>Extended Network</span>
        </p>
      </div>
    );
  }

  return (
    <a
      href={presave.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: "none" }}
    >
      <div
        className="y2k-card"
        style={{
          background: "rgba(255, 255, 255, 0.8)",
          cursor: "pointer",
          transition: "transform 0.15s ease",
          padding: "24px",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <div style={{ textAlign: "center", marginBottom: "4px" }}>
          {highContrast ? (
            <div className="y2k-card-header">New Music</div>
          ) : (
            <img
              src="http://www.gigaglitters.com/created/I4yDoRsz1m.gif"
              width="272"
              height="67"
              alt="Pre-Save - Glitter Graphics"
            />
          )}
        </div>
        <p style={{ textAlign: "center", margin: 0, fontSize: "14px" }}>
          {presave.text && /\{[^}]+\}/.test(presave.text) ? (
            presave.text.split(/\{[^}]+\}/).map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span style={{ fontSize: "24px", fontWeight: "bold", color: "#FF0000" }}>{presave.songName}</span>
                )}
              </span>
            ))
          ) : (
            <>
              <span style={{ fontSize: "24px", fontWeight: "bold", color: "#FF0000" }}>{presave.songName}</span>{" "}
              <span>{presave.text || " "}</span>
            </>
          )}
        </p>
      </div>
    </a>
  );
}
