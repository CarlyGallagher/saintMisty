const express = require("express");

const router = express.Router();

const BANDSINTOWN_BASE = "https://rest.bandsintown.com";
const APP_ID = process.env.BANDSINTOWN_APP_ID;
const ARTIST = process.env.BANDSINTOWN_ARTIST || "Saint Misty";

// Simple in-memory cache (5 min TTL)
let cache = { data: null, expiry: 0 };
const CACHE_TTL = 5 * 60 * 1000;

function formatDate(isoString) {
  const d = new Date(isoString);
  const months = [
    "Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.",
    "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."
  ];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function formatTime(isoString) {
  const d = new Date(isoString);
  let hours = d.getHours();
  const minutes = d.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const mins = minutes.toString().padStart(2, "0");
  return `${hours}:${mins} ${ampm}`;
}

function transformEvent(event) {
  const venue = event.venue || {};
  const city = venue.region
    ? `${venue.city}, ${venue.region}`
    : venue.city || "";

  // Use the first offer URL if available, otherwise fall back to the Bandsintown event page
  const offer = (event.offers || []).find((o) => o.url);
  const ticketUrl = offer ? offer.url : event.url || "";

  return {
    id: event.id,
    date: formatDate(event.datetime),
    time: formatTime(event.datetime),
    venue: venue.name || "",
    city,
    ticketUrl,
    bandsintownUrl: event.url || "",
  };
}

// Get all upcoming shows (public, proxied from Bandsintown)
router.get("/", async (_req, res) => {
  try {
    // Return cached data if still valid
    if (cache.data && Date.now() < cache.expiry) {
      return res.json(cache.data);
    }

    const url = `${BANDSINTOWN_BASE}/artists/${encodeURIComponent(ARTIST)}/events/?app_id=${APP_ID}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Bandsintown API error: ${response.status}`);
      return res.status(502).json({ error: "Failed to fetch shows from Bandsintown" });
    }

    const events = await response.json();
    const shows = Array.isArray(events) ? events.map(transformEvent) : [];

    // Update cache
    cache = { data: shows, expiry: Date.now() + CACHE_TTL };

    res.json(shows);
  } catch (err) {
    console.error("Failed to fetch shows from Bandsintown:", err);
    res.status(500).json({ error: "Failed to fetch shows" });
  }
});

module.exports = router;
