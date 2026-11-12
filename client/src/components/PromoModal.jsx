import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchSettings } from "../api/settings";
import "../styles/PromoModal.css";

// Pages where the promo shouldn't interrupt
// (/blog opens the email sign-up pop-up instead, so the promo would stack on top of it)
const EXCLUDED_PATHS = ["/admin", "/epk-", "/email-preferences", "/blog"];

const PromoModal = ({ promo }) => {
  const { pathname } = useLocation();
  const seenKey = promo ? `promoSeen:${promo.id}` : null;
  const [open, setOpen] = useState(false);

  // Only open once the server confirms the admin hasn't disabled the promo
  useEffect(() => {
    if (!promo || EXCLUDED_PATHS.some((p) => pathname.startsWith(p))) return;
    try {
      if (sessionStorage.getItem(seenKey)) return;
    } catch {}

    let cancelled = false;
    fetchSettings()
      .then(({ promoEnabled }) => !cancelled && promoEnabled && setOpen(true))
      .catch(() => !cancelled && setOpen(true)); // fall back to showing if settings can't load
    return () => {
      cancelled = true;
    };
    // Only decide on first load, like before; don't pop up on later navigation
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    try {
      sessionStorage.setItem(seenKey, "1");
    } catch {}
  }, [seenKey]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  if (!open) return null;

  return (
    <div className="promo-modal-overlay" onClick={close}>
      <div
        className="promo-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="promo-modal-title"
        style={promo.image ? { backgroundImage: `url(${promo.image})` } : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="promo-modal-close" onClick={close} aria-label="Close">✕</button>
        <h2
          id="promo-modal-title"
          className="promo-modal-title"
          style={promo.titleFont ? { fontFamily: promo.titleFont } : undefined}
        >
          {promo.title}
        </h2>
        <div className="promo-modal-buttons">
          {promo.links.map(({ label, url }) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="promo-modal-button"
              onClick={close}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromoModal;
