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
        <h1 className="home-title">
          <img
            src="http://www.gigaglitters.com/created/7N3HmxwSxu.gif"
            alt="Saint Misty - Glitter Graphics"
            className="home-title-gif"
          />
        </h1>
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
            <div className="y2k-card-header">Night ButterFly Music Video</div>
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
                src="https://www.youtube.com/embed/S6FHOY4ZwAE?autoplay=1&mute=1&loop=1&playlist=S6FHOY4ZwAE"
                title="Night ButterFly Music Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          <NetworkCard />
          <BlogCard />
          <AboutCard />
          <FriendCard />
        </div>
      </div>

      {/* Footer */}
      <div style={{
        backgroundColor: "#f33e92ff",
        textAlign: "center",
        padding: "20px",
        fontSize: "125%",
        marginTop: "24px",
        width: "100%"
      }}>
        <p style={{ margin: "0 0 8px 0" }}>
          <a href="https://www.tiktok.com/@sexybenfranklin?_r=1&_t=ZT-92pW9qq9YJp" target="_blank" rel="noopener noreferrer">TikTok</a>
          {" | "}
          <a href="https://www.instagram.com/thesaintmisty?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer">Instagram</a>
          {" | "}
          <a href="https://open.spotify.com/artist/3ATKsyAg4Ua8cs2VJJN0CC?si=MsJYW4RKSOWXFqz6YyiPQg" target="_blank" rel="noopener noreferrer">Spotify</a>
          {" | "}
          <a href="https://music.apple.com/us/artist/saint-misty/1708411597" target="_blank" rel="noopener noreferrer">Apple Music</a>
          {" | "}
          <a href="https://youtu.be/dQw4w9WgXcQ?si=ZDxVBO8ixFw3J5K1" target="_blank" rel="noopener noreferrer">Deezer</a>
          {" | "}
          <a href="https://youtube.com/@thesaintmisty?si=YnOon4BxonWhl4dc" target="_blank" rel="noopener noreferrer">YouTube</a>
        </p>
        <p style={{ margin: "8px 0 0 0", color: "#666" }}>
          © 2026 Saint Misty
        </p>
      </div>
    </div>
  );
}
