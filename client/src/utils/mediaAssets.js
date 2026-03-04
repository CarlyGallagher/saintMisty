// Import all photo assets
import HallelujahShoot from "../assets/Hallelujah-shoot.webp";
import SMDaliGras from "../assets/SM-DaliGras.webp";
import SMKenClub from "../assets/SM-KenClub.webp";
import SMKenClub2 from "../assets/SM-KenClub2.webp";
import SaintMistyProfile from "../assets/SaintMistyProfileImg.jpeg";
import SMSodaBar from "../assets/SM-SodaBar.webp";
import SMAlbumRelease from "../assets/SM-Album-release.webp";
import SMAlbumRelease2 from "../assets/SM-album-release2.webp";
import SMCake from "../assets/SM-Cake.webp";

// Map database URLs to actual imported assets
export const mediaAssetsMap = {
  "/static/media/Hallelujah-shoot.png": HallelujahShoot,
  "/static/media/SM-DaliGras.png": SMDaliGras,
  "/static/media/SM-KenClub.jpeg": SMKenClub,
  "/static/media/SM-KenClub2.JPG": SMKenClub2,
  "/static/media/SaintMistyProfileImg.jpeg": SaintMistyProfile,
  "/static/media/SM-SodaBar.JPG": SMSodaBar,
  "/static/media/SM-albumRelease.JPG": SMAlbumRelease,
  "/static/media/SM-Album-release.webp": SMAlbumRelease,
  "/static/media/SM-album-release2.webp": SMAlbumRelease2,
  "/static/media/SM-Cake.webp": SMCake,
};

// Helper function to get the actual asset URL
export function getMediaUrl(dbUrl) {
  // If it's a static media path, return the imported asset
  if (dbUrl && dbUrl.startsWith("/static/media/")) {
    return mediaAssetsMap[dbUrl] || dbUrl;
  }
  // Otherwise return as-is (for external URLs, videos, etc)
  return dbUrl;
}
