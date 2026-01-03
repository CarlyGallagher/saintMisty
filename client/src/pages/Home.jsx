import InfoCard from "../components/cards/InfoCard";
import InteractCard from "../components/cards/InteractCard";
import WebCard from "../components/cards/WebCard";
import MusicCard from "../components/cards/MusicCard";
import InterestsCard from "../components/cards/InterestsCard";
import NetworkCard from "../components/cards/NetworkCard";
import BlogCard from "../components/cards/BlogCard";
import AboutCard from "../components/cards/AboutCard";
import FriendCard from "../components/cards/FriendCard";
import "../styles/Home.css";

export default function Home() {
  return (
    <div className="home-container">
      {/* Site Header */}
      <div className="home-header">
        <h1 className="home-title">SAINT MISTY</h1>
        <p className="home-subtitle">Alternative R&B Artist • Los Angeles, CA</p>
      </div>

      {/* Two Column Layout */}
      <div className="y2k-grid">
        {/* Left Column */}
        <div className="y2k-column-left">
          <InfoCard />
          <InteractCard />
          <WebCard />
          <MusicCard />
          <InterestsCard />
        </div>

        {/* Right Column */}
        <div className="y2k-column-right">
          {/* Hero Video Section */}
          <div className="hero-video y2k-card">
            <div className="y2k-card-header">HAUS of Mad Video</div>
            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
              <iframe
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                  borderRadius: "4px",
                }}
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&loop=1&playlist=dQw4w9WgXcQ"
                title="HAUS of Mad Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          <NetworkCard />
          <BlogCard />
          <AboutCard />
          <FriendCard />

          {/* Footer - Social Links */}
          <div className="home-footer">
            <h3 style={{ fontSize: "14px", marginBottom: "12px", textAlign: "center" }}>
              Connect with Saint Misty
            </h3>
            <div className="social-links">
              <a
                href="https://www.tiktok.com/@saintmisty"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                TikTok
              </a>
              <a
                href="https://www.instagram.com/saintmisty"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                Instagram
              </a>
              <a
                href="https://open.spotify.com/artist/saintmisty"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                Spotify
              </a>
              <a
                href="https://music.apple.com/artist/saintmisty"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                Apple Music
              </a>
              <a
                href="https://www.deezer.com/artist/saintmisty"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                Deezer
              </a>
              <a
                href="https://www.youtube.com/@saintmisty"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                YouTube
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
