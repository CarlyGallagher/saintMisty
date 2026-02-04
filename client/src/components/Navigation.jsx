import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAccessibility } from "../context/AccessibilityContext";
import "../styles/Navigation.css";

export default function Navigation() {
  const { user, logout } = useAuth();
  const { highContrast, toggleHighContrast } = useAccessibility();
  const [showSocials, setShowSocials] = useState(false);
  const [showMusic, setShowMusic] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (mobileMenuOpen && isMobile) {
      const handleClickOutside = (e) => {
        if (!e.target.closest('.y2k-nav-container')) {
          setMobileMenuOpen(false);
        }
      };
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [mobileMenuOpen, isMobile]);

  const toggleDropdown = (dropdown) => {
    if (isMobile) {
      if (dropdown === 'socials') {
        setShowSocials(!showSocials);
        setShowMusic(false);
      } else if (dropdown === 'music') {
        setShowMusic(!showMusic);
        setShowSocials(false);
      }
    }
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setMobileMenuOpen(false);
      setShowSocials(false);
      setShowMusic(false);
    }
  };

  return (
    <nav className="y2k-nav" role="navigation" aria-label="Main navigation">
      <div className="y2k-nav-container">
        <Link to="/" className="y2k-nav-logo" aria-label="Saint Misty Home" onClick={handleLinkClick}>
          <img
            src="http://www.gigaglitters.com/created/4cxtwBEwKC.gif"
            width="294"
            height="67"
            alt="Saint Misty Logo"
          />
        </Link>

        {/* Mobile Hamburger Button */}
        <button
          className={`y2k-nav-hamburger ${mobileMenuOpen ? 'open' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            setMobileMenuOpen(!mobileMenuOpen);
          }}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`y2k-nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`} role="menubar">
          <Link to="/" className="y2k-nav-link" onClick={handleLinkClick}>
            HOME
          </Link>

          <div
            className="y2k-nav-dropdown"
            {...(!isMobile && {
              onMouseEnter: () => setShowSocials(true),
              onMouseLeave: () => setShowSocials(false),
            })}
            role="menuitem"
            aria-haspopup="true"
            aria-expanded={showSocials}
          >
            <button
              className="y2k-nav-link y2k-nav-dropdown-button"
              onClick={() => toggleDropdown('socials')}
              aria-label="Social media links"
            >
              SOCIALS
            </button>
            {showSocials && (
              <div className="y2k-nav-dropdown-menu" role="menu" aria-label="Social media links">
                <a
                  href="https://www.tiktok.com/@sexybenfranklin?is_from_webapp=1&sender_device=pc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="y2k-nav-dropdown-item"
                  role="menuitem"
                  aria-label="Visit Saint Misty on TikTok"
                  onClick={handleLinkClick}
                >
                  TikTok
                </a>
                <a
                  href="https://www.instagram.com/thesaintmisty"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="y2k-nav-dropdown-item"
                  role="menuitem"
                  aria-label="Visit Saint Misty on Instagram"
                  onClick={handleLinkClick}
                >
                  Instagram
                </a>
                <a
                  href="https://youtube.com/@thesaintmisty?si=qmSVssxdcYAkEZcJ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="y2k-nav-dropdown-item"
                  role="menuitem"
                  aria-label="Visit Saint Misty on YouTube"
                  onClick={handleLinkClick}
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
            onClick={handleLinkClick}
          >
            SHOP
          </a>

          <div
            className="y2k-nav-dropdown"
            {...(!isMobile && {
              onMouseEnter: () => setShowMusic(true),
              onMouseLeave: () => setShowMusic(false),
            })}
            role="menuitem"
            aria-haspopup="true"
            aria-expanded={showMusic}
          >
            <button
              className="y2k-nav-link y2k-nav-dropdown-button"
              onClick={() => toggleDropdown('music')}
              aria-label="Music streaming platforms"
            >
              MUSIC
            </button>
            {showMusic && (
              <div className="y2k-nav-dropdown-menu" role="menu" aria-label="Music streaming platforms">
                <a
                  href="https://open.spotify.com/artist/3ATKsyAg4Ua8cs2VJJN0CC?si=MIyE6ajeQ8q4WuERuLhpIg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="y2k-nav-dropdown-item"
                  role="menuitem"
                  aria-label="Listen on Spotify"
                  onClick={handleLinkClick}
                >
                  Spotify
                </a>
                <a
                  href="https://music.apple.com/us/artist/saint-misty/1708411597"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="y2k-nav-dropdown-item"
                  role="menuitem"
                  aria-label="Listen on Apple Music"
                  onClick={handleLinkClick}
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
                  onClick={handleLinkClick}
                >
                  Deezer
                </a>
              </div>
            )}
          </div>

          <Link to="/shows" className="y2k-nav-link" role="menuitem" onClick={handleLinkClick}>
            SHOWS
          </Link>

          <Link to="/blog" className="y2k-nav-link" role="menuitem" onClick={handleLinkClick}>
            BLOG
          </Link>

          <Link to="/pictures" className="y2k-nav-link" role="menuitem" onClick={handleLinkClick}>
            PICS
          </Link>

          {user && (
            <>
              <Link to="/admin/dashboard" className="y2k-nav-link" role="menuitem" onClick={handleLinkClick}>
                ADMIN
              </Link>
              <button
                onClick={() => {
                  logout();
                  handleLinkClick();
                }}
                className="y2k-nav-link y2k-nav-logout"
                role="menuitem"
                aria-label="Logout from admin"
              >
                LOGOUT
              </button>
            </>
          )}

          {/* Accessibility Toggle in Mobile Menu */}
          {isMobile && (
            <div className="y2k-nav-theme-toggle-container">
              <button
                className="y2k-nav-theme-toggle"
                onClick={toggleHighContrast}
                aria-label={highContrast ? "Switch to normal mode" : "Switch to high contrast mode"}
                aria-pressed={highContrast}
              >
                <span className="toggle-track">
                  <span className={`toggle-thumb ${highContrast ? 'active' : ''}`}>
                    {highContrast ? '🌙' : '☀️'}
                  </span>
                </span>
                <span className="toggle-label">
                  {highContrast ? 'High Contrast' : 'Normal Mode'}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Accessibility Toggle for Desktop */}
        {!isMobile && (
          <button
            className="y2k-nav-theme-toggle"
            onClick={toggleHighContrast}
            aria-label={highContrast ? "Switch to normal mode" : "Switch to high contrast mode"}
            aria-pressed={highContrast}
          >
            <span className="toggle-track">
              <span className={`toggle-thumb ${highContrast ? 'active' : ''}`}>
                {highContrast ? '🌙' : '☀️'}
              </span>
            </span>
          </button>
        )}
      </div>
    </nav>
  );
}
