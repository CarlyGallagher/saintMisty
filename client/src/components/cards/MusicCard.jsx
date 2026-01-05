export default function MusicCard() {
  return (
    <div className="y2k-card">
      <div className="y2k-card-header">Music Player</div>
      <div style={{ textAlign: "center" }}>
        <img
          src="https://via.placeholder.com/200"
          alt="Album Cover"
          className="y2k-img"
          style={{ width: "200px", height: "200px", marginBottom: "12px" }}
        />
        <p style={{ fontSize: "13px", fontWeight: "bold", marginBottom: "4px" }}>
          Now Playing
        </p>
        <p style={{ fontSize: "12px", color: "#666", marginBottom: "12px" }}>
          Saint Misty - Track Title
        </p>
        <div
          style={{
            background: "#000",
            height: "4px",
            borderRadius: "2px",
            marginBottom: "12px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "#FF0000",
              height: "100%",
              width: "40%",
            }}
          ></div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "12px" }}>
          <button className="y2k-button-secondary y2k-button" style={{ padding: "8px 12px", fontSize: "11px" }}>
            ⏮ Back
          </button>
          <button className="y2k-button" style={{ padding: "8px 16px", fontSize: "11px" }}>
            ▶ Play
          </button>
          <button className="y2k-button-secondary y2k-button" style={{ padding: "8px 12px", fontSize: "11px" }}>
            Next ⏭
          </button>
        </div>
        <p style={{ fontSize: "11px", color: "#666" }}>
          Music player coming soon! For now, stream on Spotify, Apple Music, or Deezer.
        </p>
      </div>
    </div>
  );
}
