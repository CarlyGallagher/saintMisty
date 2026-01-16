import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAccessibility } from "../context/AccessibilityContext";
import "../styles/Navigation.css";

export default function Navigation() {
  const { user, logout } = useAuth();
  const { highContrast, toggleHighContrast } = useAccessibility();
  const [showSocials, setShowSocials] = useState(false);
  const [showMusic, setShowMusic] = useState(false);

  return (
    <nav className="y2k-nav" role="navigation" aria-label="Main navigation">
      <div className="y2k-nav-container">
        <Link to="/" className="y2k-nav-logo" aria-label="Saint Misty Home">
          <img src="http://www.gigaglitters.com/created/4cxtwBEwKC.gif" width="294" height="67" border="0" alt="Saint Misty Logo" />
        </Link>

        <div className="y2k-nav-links" role="menubar">
          <Link to="/" className="y2k-nav-link">
            HOME
          </Link>

          <div
            className="y2k-nav-dropdown"
            onMouseEnter={() => setShowSocials(true)}
            onMouseLeave={() => setShowSocials(false)}
            role="menuitem"
            aria-haspopup="true"
            aria-expanded={showSocials}
          >
            <span className="y2k-nav-link">SOCIALS</span>
            {showSocials && (
              <div className="y2k-nav-dropdown-menu" role="menu" aria-label="Social media links">
                <a
                  href="https://www.tiktok.com/@saintmisty"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="y2k-nav-dropdown-item"
                  role="menuitem"
                  aria-label="Visit Saint Misty on TikTok"
                >
                  TikTok
                </a>
                <a
                  href="https://www.instagram.com/saintmisty"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="y2k-nav-dropdown-item"
                  role="menuitem"
                  aria-label="Visit Saint Misty on Instagram"
                >
                  Instagram
                </a>
                <a
                  href="https://www.youtube.com/@saintmisty"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="y2k-nav-dropdown-item"
                  role="menuitem"
                  aria-label="Visit Saint Misty on YouTube"
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
            role="menuitem"
            aria-label="Shop Saint Misty merchandise"
          >
            SHOP
          </a>

          <div
            className="y2k-nav-dropdown"
            onMouseEnter={() => setShowMusic(true)}
            onMouseLeave={() => setShowMusic(false)}
            role="menuitem"
            aria-haspopup="true"
            aria-expanded={showMusic}
          >
            <span className="y2k-nav-link">MUSIC</span>
            {showMusic && (
              <div className="y2k-nav-dropdown-menu" role="menu" aria-label="Music streaming platforms">
                <a
                  href="https://open.spotify.com/artist/saintmisty"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="y2k-nav-dropdown-item"
                  role="menuitem"
                  aria-label="Listen on Spotify"
                >
                  Spotify
                </a>
                <a
                  href="https://music.apple.com/artist/saintmisty"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="y2k-nav-dropdown-item"
                  role="menuitem"
                  aria-label="Listen on Apple Music"
                >
                  Apple Music
                </a>
                <a
                  href="https://www.deezer.com/us/artist/231301315?host=6747341883&utm_campaign=clipboard-generic&utm_source=user_sharing&utm_content=artist-231301315&deferredFl=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="y2k-nav-dropdown-item"
                  role="menuitem"
                  aria-label="Listen on Deezer"
                >
                  Deezer
                </a>
              </div>
            )}
          </div>

          <Link to="/shows" className="y2k-nav-link" role="menuitem">
            SHOWS
          </Link>

          <Link to="/blog" className="y2k-nav-link" role="menuitem">
            BLOG
          </Link>

          <Link to="/pictures" className="y2k-nav-link" role="menuitem">
            PICS
          </Link>

          {user && (
            <>
              <Link to="/admin/dashboard" className="y2k-nav-link" role="menuitem">
                ADMIN
              </Link>
              <button onClick={logout} className="y2k-nav-link y2k-nav-logout" role="menuitem" aria-label="Logout from admin">
                LOGOUT
              </button>
            </>
          )}
        </div>

        <button
          className="y2k-nav-accessibility"
          onClick={toggleHighContrast}
          aria-label={highContrast ? "Disable high contrast mode" : "Enable high contrast mode"}
          aria-pressed={highContrast}
          title="Toggle High Contrast Mode"
        >
          ♿
        </button>
      </div>
    </nav>
  );
}
