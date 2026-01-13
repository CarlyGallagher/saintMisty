import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navigation.css";

export default function Navigation() {
  const { user, logout } = useAuth();
  const [showSocials, setShowSocials] = useState(false);
  const [showMusic, setShowMusic] = useState(false);

  return (
    <nav className="y2k-nav">
      <div className="y2k-nav-container">
        <Link to="/" className="y2k-nav-logo">
          <img src="http://www.gigaglitters.com/created/4cxtwBEwKC.gif" width="294" height="67" border="0" alt="Saint Misty - Glitter Graphics" />
        </Link>

        <div className="y2k-nav-links">
          <Link to="/" className="y2k-nav-link">
            HOME
          </Link>

          <div
            className="y2k-nav-dropdown"
            onMouseEnter={() => setShowSocials(true)}
            onMouseLeave={() => setShowSocials(false)}
          >
            <span className="y2k-nav-link">SOCIALS</span>
            {showSocials && (
              <div className="y2k-nav-dropdown-menu">
                <a
                  href="https://www.tiktok.com/@saintmisty"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="y2k-nav-dropdown-item"
                >
                  TikTok
                </a>
                <a
                  href="https://www.instagram.com/saintmisty"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="y2k-nav-dropdown-item"
                >
                  Instagram
                </a>
                <a
                  href="https://www.youtube.com/@saintmisty"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="y2k-nav-dropdown-item"
                >
                  YouTube
                </a>
              </div>
            )}
          </div>

          <a
            href="https://saint-misty.printify.me/category/all/1"
            target="_blank"
            rel="noopener noreferrer"
            className="y2k-nav-link"
          >
            SHOP
          </a>

          <div
            className="y2k-nav-dropdown"
            onMouseEnter={() => setShowMusic(true)}
            onMouseLeave={() => setShowMusic(false)}
          >
            <span className="y2k-nav-link">MUSIC</span>
            {showMusic && (
              <div className="y2k-nav-dropdown-menu">
                <a
                  href="https://open.spotify.com/artist/saintmisty"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="y2k-nav-dropdown-item"
                >
                  Spotify
                </a>
                <a
                  href="https://music.apple.com/artist/saintmisty"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="y2k-nav-dropdown-item"
                >
                  Apple Music
                </a>
                <a
                  href="https://www.deezer.com/us/artist/231301315?host=6747341883&utm_campaign=clipboard-generic&utm_source=user_sharing&utm_content=artist-231301315&deferredFl=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="y2k-nav-dropdown-item"
                >
                  Deezer
                </a>
              </div>
            )}
          </div>

          <Link to="/shows" className="y2k-nav-link">
            SHOWS
          </Link>

          <Link to="/blog" className="y2k-nav-link">
            BLOG
          </Link>

          <Link to="/pictures" className="y2k-nav-link">
            PICS
          </Link>

          {user && (
            <>
              <Link to="/admin/dashboard" className="y2k-nav-link">
                ADMIN
              </Link>
              <button onClick={logout} className="y2k-nav-link y2k-nav-logout">
                LOGOUT
              </button>
            </>
          )}
        </div>

        <button className="y2k-nav-accessibility" title="Toggle Accessibility Mode">
          ♿
        </button>
      </div>
    </nav>
  );
}
