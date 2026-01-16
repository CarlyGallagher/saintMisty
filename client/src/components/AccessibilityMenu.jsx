import { useAccessibility } from "../context/AccessibilityContext";
import "../styles/accessibility.css";

export default function AccessibilityMenu() {
  const {
    showAccessibilityMenu,
    highContrast,
    largeText,
    reducedMotion,
    toggleHighContrast,
    toggleLargeText,
    toggleReducedMotion,
    setShowAccessibilityMenu,
    resetAll
  } = useAccessibility();

  if (!showAccessibilityMenu) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowAccessibilityMenu(false);
    }
  };

  const handleReset = () => {
    resetAll();
  };

  return (
    <div
      className="accessibility-menu-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-labelledby="accessibility-menu-title"
      aria-modal="true"
    >
      <div className="accessibility-menu">
        <h2 id="accessibility-menu-title">Accessibility Options</h2>
        <p style={{ marginBottom: "20px", color: "#666" }}>
          Customize your viewing experience
        </p>

        {/* High Contrast Mode */}
        <div className="accessibility-option">
          <div className="accessibility-option-info">
            <h3>High Contrast Mode</h3>
            <p>Classic MySpace blue and white color scheme for better readability</p>
          </div>
          <button
            className={`accessibility-toggle ${highContrast ? "active" : ""}`}
            onClick={toggleHighContrast}
            aria-pressed={highContrast}
            aria-label="Toggle high contrast mode"
          >
            <div className="accessibility-toggle-slider"></div>
            <span className="sr-only">
              {highContrast ? "Disable" : "Enable"} high contrast mode
            </span>
          </button>
        </div>

        {/* Large Text */}
        <div className="accessibility-option">
          <div className="accessibility-option-info">
            <h3>Larger Text</h3>
            <p>Increase font sizes across the entire site</p>
          </div>
          <button
            className={`accessibility-toggle ${largeText ? "active" : ""}`}
            onClick={toggleLargeText}
            aria-pressed={largeText}
            aria-label="Toggle large text"
          >
            <div className="accessibility-toggle-slider"></div>
            <span className="sr-only">
              {largeText ? "Disable" : "Enable"} large text
            </span>
          </button>
        </div>

        {/* Reduced Motion */}
        <div className="accessibility-option">
          <div className="accessibility-option-info">
            <h3>Reduced Motion</h3>
            <p>Minimize animations and transitions for motion sensitivity</p>
          </div>
          <button
            className={`accessibility-toggle ${reducedMotion ? "active" : ""}`}
            onClick={toggleReducedMotion}
            aria-pressed={reducedMotion}
            aria-label="Toggle reduced motion"
          >
            <div className="accessibility-toggle-slider"></div>
            <span className="sr-only">
              {reducedMotion ? "Disable" : "Enable"} reduced motion
            </span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="accessibility-menu-actions">
          <button
            className="accessibility-reset-btn"
            onClick={handleReset}
            aria-label="Reset all accessibility settings to default"
          >
            Reset All
          </button>
          <button
            className="accessibility-close-btn"
            onClick={() => setShowAccessibilityMenu(false)}
            aria-label="Close accessibility menu"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
