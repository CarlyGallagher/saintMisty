// Import all photo assets
import HallelujahShoot from "../assets/Hallelujah-shoot.png";
import SMDaliGras from "../assets/SM-DaliGras.png";
import SMKenClub from "../assets/SM-KenClub.jpeg";
import SMKenClub2 from "../assets/SM-KenClub2.JPG";
import SMFansCasbah from "../assets/SM-fans-Casbah.jpeg";
import SMYourMan from "../assets/SM-yourMan.jpeg";
import SaintMistyMontegue from "../assets/SaintMisty-Montegue.jpg";
import SaintMistyProfile from "../assets/SaintMistyProfileImg.jpeg";
import SMSodaBar from "../assets/SM-SodaBar.JPG";
import SMAlbumRelease from "../assets/SM-albumRelease.JPG";

// Map database URLs to actual imported assets
export const mediaAssetsMap = {
  "/static/media/Hallelujah-shoot.png": HallelujahShoot,
  "/static/media/SM-DaliGras.png": SMDaliGras,
  "/static/media/SM-KenClub.jpeg": SMKenClub,
  "/static/media/SM-KenClub2.JPG": SMKenClub2,
  "/static/media/SM-fans-Casbah.jpeg": SMFansCasbah,
  "/static/media/SM-yourMan.jpeg": SMYourMan,
  "/static/media/SaintMisty-Montegue.jpg": SaintMistyMontegue,
  "/static/media/SaintMistyProfileImg.jpeg": SaintMistyProfile,
  "/static/media/SM-SodaBar.JPG": SMSodaBar,
  "/static/media/SM-albumRelease.JPG": SMAlbumRelease,
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
