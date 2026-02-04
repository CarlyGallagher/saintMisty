import { useState, useEffect } from "react";
import { fetchMedia } from "../api/media";
import { getMediaUrl } from "../utils/mediaAssets";
import "../styles/PicturesVideos.css";

// Tab button component
function TabButton({ active, onClick, children }) {
  return (
    <button
      className={`tab-button ${active ? "active" : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// Media thumbnail component
function MediaThumbnail({ media }) {
  const imageUrl = media.type === "video" ? media.thumbnail : media.url;

  return (
    <div className="media-thumbnail">
      <img src={getMediaUrl(imageUrl)} alt={media.title} />
      {media.type === "video" && <div className="play-button">▶</div>}
    </div>
  );
}

// Lightbox component
function Lightbox({ media, onClose, onPrevious, onNext }) {
  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose}>✕</button>

        <button className="lightbox-arrow lightbox-left" onClick={onPrevious}>‹</button>

        <div className="lightbox-media">
          {media.type === "video" ? (
            <iframe
              src={media.videoUrl}
              title={media.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <img src={getMediaUrl(media.url)} alt={media.title} />
          )}
        </div>

        <button className="lightbox-arrow lightbox-right" onClick={onNext}>›</button>

        <div className="lightbox-title">{media.title}</div>
      </div>
    </div>
  );
}

// Main component
export default function PicturesVideos() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mediaItems, setMediaItems] = useState([]);

  useEffect(() => {
    fetchMedia()
      .then(setMediaItems)
      .catch((error) => console.error("Failed to fetch media:", error));
  }, []);

  // Filter and sort media
  const getDisplayMedia = () => {
    const typeMap = { pictures: "photo", videos: "video" };
    const filtered = activeTab === "all"
      ? mediaItems
      : mediaItems.filter((item) => item.type === typeMap[activeTab]);

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const displayMedia = getDisplayMedia();

  const handleMediaClick = (media, index) => {
    setSelectedMedia(media);
    setCurrentIndex(index);
  };

  const navigateMedia = (direction) => {
    const newIndex = direction === "next"
      ? (currentIndex + 1) % displayMedia.length
      : currentIndex > 0 ? currentIndex - 1 : displayMedia.length - 1;

    setCurrentIndex(newIndex);
    setSelectedMedia(displayMedia[newIndex]);
  };

  return (
    <div className="pictures-videos-container">
      <div className="pictures-videos-header">
        <img
          src="http://www.gigaglitters.com/created/6HqSXNrTXq.gif"
          alt="Photos & Videos - Glitter Graphics"
          className="pictures-videos-header-gif"
        />
      </div>

      <div className="pictures-videos-tabs">
        <TabButton active={activeTab === "pictures"} onClick={() => setActiveTab("pictures")}>
          PICTURES
        </TabButton>
        <span className="tab-separator">|</span>
        <TabButton active={activeTab === "videos"} onClick={() => setActiveTab("videos")}>
          VIDEOS
        </TabButton>
        <span className="tab-separator">|</span>
        <TabButton active={activeTab === "all"} onClick={() => setActiveTab("all")}>
          ALL
        </TabButton>
      </div>

      <div className="media-grid">
        {displayMedia.map((media, index) => (
          <div
            key={media._id || media.id}
            className="media-item"
            onClick={() => handleMediaClick(media, index)}
          >
            <MediaThumbnail media={media} />
            <p className="media-title">{media.title}</p>
          </div>
        ))}
      </div>

      {selectedMedia && (
        <Lightbox
          media={selectedMedia}
          onClose={() => setSelectedMedia(null)}
          onPrevious={() => navigateMedia("prev")}
          onNext={() => navigateMedia("next")}
        />
      )}
    </div>
  );
}
