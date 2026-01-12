import { useState, useEffect } from "react";
import { fetchMedia } from "../api/media";
import "../styles/PicturesVideos.css";

export default function PicturesVideos() {
  const [activeTab, setActiveTab] = useState("all"); // all, pictures, videos
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch media from backend
  useEffect(() => {
    (async () => {
      try {
        const media = await fetchMedia();
        setMediaItems(media);
      } catch (error) {
        console.error("Failed to fetch media:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filter media based on active tab
  const filteredMedia = mediaItems.filter((item) => {
    if (activeTab === "all") return true;
    if (activeTab === "pictures") return item.type === "photo";
    if (activeTab === "videos") return item.type === "video";
    return true;
  });

  // Sort by date (newest to oldest)
  const sortedMedia = [...filteredMedia].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const handleMediaClick = (media, index) => {
    setSelectedMedia(media);
    setCurrentIndex(index);
  };

  const handleClose = () => {
    setSelectedMedia(null);
  };

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : sortedMedia.length - 1;
    setCurrentIndex(newIndex);
    setSelectedMedia(sortedMedia[newIndex]);
  };

  const handleNext = () => {
    const newIndex = currentIndex < sortedMedia.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    setSelectedMedia(sortedMedia[newIndex]);
  };

  return (
    <div className="pictures-videos-container">
      {/* Header */}
      <div className="pictures-videos-header">
        <h1>Saint Misty's Photos & Videos</h1>
      </div>

      {/* Tab Navigation */}
      <div className="pictures-videos-tabs">
        <button
          className={`tab-button ${activeTab === "pictures" ? "active" : ""}`}
          onClick={() => setActiveTab("pictures")}
        >
          PICTURES
        </button>
        <span className="tab-separator">|</span>
        <button
          className={`tab-button ${activeTab === "videos" ? "active" : ""}`}
          onClick={() => setActiveTab("videos")}
        >
          VIDEOS
        </button>
        <span className="tab-separator">|</span>
        <button
          className={`tab-button ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          ALL
        </button>
      </div>

      {/* Media Grid */}
      <div className="media-grid">
        {sortedMedia.map((media, index) => (
          <div
            key={media.id}
            className="media-item"
            onClick={() => handleMediaClick(media, index)}
          >
            {media.type === "video" ? (
              <div className="media-thumbnail">
                <img src={media.thumbnail} alt={media.title} />
                <div className="play-button">▶</div>
              </div>
            ) : (
              <img src={media.url} alt={media.title} className="media-thumbnail" />
            )}
            <p className="media-title">{media.title}</p>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedMedia && (
        <div className="lightbox-overlay" onClick={handleClose}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={handleClose}>
              ✕
            </button>

            <button className="lightbox-arrow lightbox-left" onClick={handlePrevious}>
              ‹
            </button>

            <div className="lightbox-media">
              {selectedMedia.type === "video" ? (
                <iframe
                  src={selectedMedia.videoUrl}
                  title={selectedMedia.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <img src={selectedMedia.url} alt={selectedMedia.title} />
              )}
            </div>

            <button className="lightbox-arrow lightbox-right" onClick={handleNext}>
              ›
            </button>

            <div className="lightbox-title">{selectedMedia.title}</div>
          </div>
        </div>
      )}
    </div>
  );
}
