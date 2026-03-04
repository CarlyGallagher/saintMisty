import motoImg from "../assets/SM-Moto.webp";
import motoBrightImg from "../assets/sm-motoBright.webp";
import { useAccessibility } from "../context/AccessibilityContext";
import "../styles/EPK.css";

export default function EPK() {
  const { highContrast } = useAccessibility();

  return (
    <div className="epk-page">

      {/* Hero */}
      <div className="epk-hero">
        <img
          src={highContrast ? motoBrightImg : motoImg}
          alt="Saint Misty on a motorbike"
          className="epk-hero-img"
          loading="lazy"
          width="1920"
          height="1080"
        />
        <div className="epk-hero-overlay">
          <p className="epk-hero-eyebrow">Electronic Press Kit</p>
          <h1 className="epk-hero-name">Saint Misty</h1>
        </div>
        <div className="epk-hero-fade" />

        {/* Stats — absolute bottom-right on desktop, inline on mobile */}
        <div className="epk-hero-stats">
          <div className="epk-hero-stat">
            <span className="epk-stat-number">22K</span>
            <span className="epk-stat-platform">TikTok</span>
          </div>
          <div className="epk-hero-stat">
            <span className="epk-stat-number">10K</span>
            <span className="epk-stat-platform">Instagram</span>
          </div>
          <div className="epk-hero-stat">
            <span className="epk-stat-number">1.5K</span>
            <span className="epk-stat-platform">Spotify</span>
          </div>
        </div>
      </div>

      <div className="epk-body">

        {/* Contact */}
        <section className="epk-section">
          <h2 className="epk-section-title">Booking &amp; Contact</h2>
          <div className="epk-contact-grid">
            <div className="epk-contact-block">
              <p className="epk-contact-role">Management</p>
              <a href="mailto:natalie@raspberrymanagement.com" className="epk-contact-email">
                natalie@raspberrymanagement.com
              </a>
            </div>
            <div className="epk-contact-block">
              <p className="epk-contact-role">Artist</p>
              <a href="mailto:thesaintmisty@gmail.com" className="epk-contact-email">
                thesaintmisty@gmail.com
              </a>
            </div>
          </div>
        </section>

        <div className="epk-divider" />

        {/* Bio */}
        <section className="epk-section">
          <h2 className="epk-section-title">Bio</h2>
          <p className="epk-bio">
            Saint Misty is a San Diego-based synth-pop artist whose sticky-sweet hooks wrap around songs
            that reckon with identity and escape, tracing her journey from radical Christian cult to lesbian
            icon in the making. Siphoning disco dance and punk defiance energy from 70s/80s pop while adding
            her fresh take on bright synths and sharp lyrics, Saint Misty reflects only to reclaim. The result
            is a joyful celebration of self-acceptance that resonates deeply with Saint Misty's growing fandom
            of women and queer-dos who see themselves in her online and stage persona and hear their story in
            her songs.
          </p>
        </section>

        <div className="epk-divider" />

        {/* Live Performances */}
        <section className="epk-section">
          <h2 className="epk-section-title">Live Performances</h2>
          <div className="epk-video-grid">
            <div className="epk-video-block">
              <p className="epk-video-label">Kensington Club — 01/02/26</p>
              <div className="epk-video-wrapper">
                <iframe
                  src="https://www.youtube.com/embed/QRKRpkkAnDQ"
                  title="Saint Misty at Kensington Club 01/02/26"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
            <div className="epk-video-block">
              <p className="epk-video-label">Public Square — 02/14/25</p>
              <div className="epk-video-wrapper">
                <iframe
                  src="https://www.youtube.com/embed/z62JwH1gtd8"
                  title="Saint Misty at Public Square 02/14/25"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        <div className="epk-divider" />

        {/* Press */}
        <section className="epk-section">
          <h2 className="epk-section-title">Press</h2>

          <blockquote className="epk-press-quote">
            "A truly incredible local artist… catchy pop tunes that were impossible to ignore.
            An important fixture in the local scene right now."
            <cite className="epk-press-cite">
              —{" "}
              <a href="https://listensd.com/dimes-residency-casbah-nights-1-3/" target="_blank" rel="noopener noreferrer">
                Listen SD
              </a>
            </cite>
          </blockquote>

          <blockquote className="epk-press-quote">
            "A lot of my songs are just me unpacking my past, being raised in a very religious environment
            and later coming out as a lesbian."
            <cite className="epk-press-cite">
              — Saint Misty via{" "}
              <a href="https://sdvoyager.com/interview/meet-mikayla-marsh-of-north-park/" target="_blank" rel="noopener noreferrer">
                San Diego Voyager — Meet Mikayla Marsh of North Park
              </a>
            </cite>
          </blockquote>
        </section>

        <div className="epk-divider" />

        {/* Shows & Festivals */}
        <section className="epk-section epk-history-section">
          <div className="epk-history-col">
            <h2 className="epk-section-title">Venue History</h2>
            <ul className="epk-venue-list">
              <li>Kensington Club <span>San Diego, CA</span></li>
              <li>Casbah <span>San Diego, CA</span></li>
              <li>Soda Bar <span>San Diego, CA</span></li>
              <li>Public Square <span>La Mesa, CA</span></li>
              <li>The Basement <span>Nashville, TN</span></li>
            </ul>
          </div>
          <div className="epk-history-col">
            <h2 className="epk-section-title">Festival History</h2>
            <ul className="epk-venue-list">
              <li>Dali's Gras <span>San Diego, CA — Apr 2025</span></li>
              <li>SD SheFest Pride <span>San Diego, CA — Oct 2025</span></li>
            </ul>
          </div>
        </section>

      </div>
    </div>
  );
}
