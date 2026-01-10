import { useState } from "react";
import "../styles/PicturesVideos.css";

export default function PicturesVideos() {
  const [activeTab, setActiveTab] = useState("all"); // all, pictures, videos
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sample media data (replace with actual data later)
  // Replace these placeholder images with your actual photo/video URLs
  const mediaItems = [
    {
      id: 1,
      type: "video",
      title: "Night Butterfly Behind the Scenes",
      thumbnail: "https://img.youtube.com/vi/S6FHOY4ZwAE/mqdefault.jpg",
      videoUrl: "https://www.youtube.com/embed/S6FHOY4ZwAE",
      date: "2026-01-08",
    },
    {
      id: 2,
      type: "photo",
      title: "Studio Session",
      url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23FF1493'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='24' fill='white'%3EStudio Session%3C/text%3E%3C/svg%3E",
      date: "2026-01-07",
    },
    {
      id: 3,
      type: "photo",
      title: "Concert Vibes",
      url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%238A2BE2'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='24' fill='white'%3EConcert Vibes%3C/text%3E%3C/svg%3E",
      date: "2026-01-06",
    },
    {
      id: 4,
      type: "video",
      title: "Taurus Sun Music Video",
      thumbnail: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23FF69B4'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='24' fill='white'%3ETaurus Sun%3C/text%3E%3C/svg%3E",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      date: "2026-01-05",
    },
    {
      id: 5,
      type: "photo",
      title: "LA Photoshoot",
      url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23FF6347'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='24' fill='white'%3ELA Photoshoot%3C/text%3E%3C/svg%3E",
      date: "2026-01-04",
    },
    {
      id: 6,
      type: "photo",
      title: "Y2K Aesthetic",
      url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%234169E1'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='24' fill='white'%3EY2K Aesthetic%3C/text%3E%3C/svg%3E",
      date: "2026-01-03",
    },
  ];

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
