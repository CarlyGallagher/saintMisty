import { useState } from "react";

export default function WebCard() {
  const [copied, setCopied] = useState(false);
  const websiteUrl = "www.saintmisty.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(websiteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="y2k-card">
      <div className="y2k-card-header">Web</div>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "12px", marginBottom: "8px", fontWeight: "bold" }}>
          Saint Misty's URL:
        </p>
        <div
          onClick={handleCopy}
          style={{
            background: "#FFF",
            border: "2px solid #000",
            borderRadius: "4px",
            padding: "8px",
            cursor: "pointer",
            fontFamily: "monospace",
            fontSize: "13px",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F5F5")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#FFF")}
        >
          {websiteUrl}
        </div>
        {copied && (
          <p style={{ color: "#FF0000", fontSize: "11px", marginTop: "4px", fontWeight: "bold" }}>
            ✓ Copied to clipboard!
          </p>
        )}
      </div>
    </div>
  );
}
