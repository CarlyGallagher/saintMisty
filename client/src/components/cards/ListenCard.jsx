import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchPresave } from "../../api/presave";

export default function ListenCard() {
  const [presave, setPresave] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchPresave();
        setPresave(data);
      } catch (error) {
        // No pre-save configured, hide the button
      }
    })();
  }, []);

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
          href="https://youtube.com/@thesaintmisty?si=qmSVssxdcYAkEZcJ"
          target="_blank"
          rel="noopener noreferrer"
          className="y2k-button"
          style={{ textAlign: "center", textDecoration: "none", display: "block" }}
        >
          YouTube
        </a>
        <Link
          to="/shows"
          className="y2k-button"
          style={{ textAlign: "center", textDecoration: "none", display: "block" }}
        >
          Tour
        </Link>
        {presave && (
          <a
            href={presave.url}
            target="_blank"
            rel="noopener noreferrer"
            className="y2k-button"
            style={{ textAlign: "center", textDecoration: "none", display: "block" }}
          >
            Pre-Save {presave.songName}
          </a>
        )}
      </div>
    </div>
  );
}
