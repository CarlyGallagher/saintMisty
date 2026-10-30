import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/PromoModal.css";

// Pages where the promo shouldn't interrupt
const EXCLUDED_PATHS = ["/admin", "/epk-"];

const PromoModal = ({ promo }) => {
  const { pathname } = useLocation();
  const seenKey = promo ? `promoSeen:${promo.id}` : null;
  const [open, setOpen] = useState(() => {
    if (!promo || EXCLUDED_PATHS.some((p) => pathname.startsWith(p))) return false;
    try {
      return !sessionStorage.getItem(seenKey);
    } catch {
      return true;
    }
  });

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
