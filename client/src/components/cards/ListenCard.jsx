export default function ListenCard() {
  return (
    <div className="y2k-card" style={{ background: "rgba(253, 66, 154, 0.8)" }}>
      <div className="y2k-card-header">Listen</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <a
          href="https://open.spotify.com/artist/3ATKsyAg4Ua8cs2VJJN0CC?si=MIyE6ajeQ8q4WuERuLhpIg"
          target="_blank"
          rel="noopener noreferrer"
          className="y2k-button"
          style={{ textAlign: "center", textDecoration: "none", display: "block" }}
        >
          Spotify
        </a>
        <a
          href="https://music.apple.com/us/artist/saint-misty/1708411597"
          target="_blank"
          rel="noopener noreferrer"
          className="y2k-button"
          style={{ textAlign: "center", textDecoration: "none", display: "block" }}
        >
          Apple Music
        </a>
        <a
          href="https://www.deezer.com/us/artist/231301315?host=6747341883&utm_campaign=clipboard-generic&utm_source=user_sharing&utm_content=artist-231301315&deferredFl=1"
          target="_blank"
          rel="noopener noreferrer"
          className="y2k-button"
          style={{ textAlign: "center", textDecoration: "none", display: "block" }}
        >
          Deezer
        </a>
      </div>
    </div>
  );
}
