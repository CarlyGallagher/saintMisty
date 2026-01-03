import { useState } from "react";

export default function InterestsCard() {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = {
    general: {
      title: "General",
      content: [
        "Music production",
        "Photography",
        "Y2K aesthetics",
        "Vintage fashion",
        "Creating art",
      ],
    },
    music: {
      title: "Music",
      content: [
        "Alternative R&B",
        "Indie Pop",
        "Electronic",
        "SZA",
        "Frank Ocean",
        "Clairo",
      ],
    },
    movies: {
      title: "Movies",
      content: [
        "Eternal Sunshine",
        "Lost in Translation",
        "The Virgin Suicides",
        "Euphoria (TV)",
        "Black Mirror",
      ],
    },
    zodiac: {
      title: "Zodiac",
      content: [
        "Sun: Pisces ♓",
        "Moon: Cancer ♋",
        "Rising: Scorpio ♏",
        "Element: Water",
      ],
    },
  };

  return (
    <div className="y2k-card">
      <div className="y2k-card-header">Interests</div>
      <div style={{ marginBottom: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {Object.entries(tabs).map(([key, { title }]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={activeTab === key ? "y2k-button" : "y2k-button y2k-button-secondary"}
            style={{ fontSize: "11px", padding: "6px 12px" }}
          >
            {title}
          </button>
        ))}
      </div>
      <ul className="y2k-list" style={{ fontSize: "13px" }}>
        {tabs[activeTab].content.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
