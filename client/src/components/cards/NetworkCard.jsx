import { useAccessibility } from "../../context/AccessibilityContext";
import { useSubscribeModal } from "../../context/SubscribeModalContext";

export default function NetworkCard() {
  const { highContrast } = useAccessibility();
  const { openSubscribeModal } = useSubscribeModal();

  return (
    <button
      onClick={openSubscribeModal}
      className="y2k-card"
      style={{
        background: "rgba(255, 255, 255, 0.8)",
        cursor: "pointer",
        transition: "transform 0.15s ease",
        padding: "24px",
        border: "none",
        width: "100%",
        textAlign: "center",
        font: "inherit",
        color: "inherit",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <div style={{ textAlign: "center", marginBottom: "4px" }}>
        {highContrast ? (
          <div className="y2k-card-header">Blog</div>
        ) : (
          <img
            src="https://www.gigaglitters.com/g/0rde4ommcif.gif"
            width="145"
            height="58"
            alt="BLOG glitter"
          />
        )}
      </div>
      <p style={{ textAlign: "center", margin: 0, fontSize: "14px" }}>
        Sign up for the newsletter to get the latest updates
      </p>
    </button>
  );
}
