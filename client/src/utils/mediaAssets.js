// Helper to resolve media URLs — Cloudinary URLs pass through as-is,
// legacy static paths are no longer used.
export function getMediaUrl(url) {
  return url || "";
}
