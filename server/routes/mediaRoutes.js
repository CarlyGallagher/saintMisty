const express = require("express");
const multer = require("multer");
const sanitizeHtml = require("sanitize-html");
const { v2: cloudinary } = require("cloudinary");
const Media = require("../models/media");
const mongoose = require("mongoose");
const { requireAuth } = require("../middleware/authMiddleware");
const logger = require("../utils/logger");

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage — file goes straight to Cloudinary, not disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (_req, file, cb) => {
    const isImage = file.mimetype.startsWith("image/");
    const isVideo = file.mimetype.startsWith("video/");
    if (isImage || isVideo) return cb(null, true);
    cb(new Error("Only image and video files are allowed"));
  },
});

// Upload buffer to Cloudinary
function uploadToCloudinary(buffer, mimetype) {
  return new Promise((resolve, reject) => {
    const resourceType = mimetype.startsWith("video") ? "video" : "image";
    const stream = cloudinary.uploader.upload_stream(
      { folder: "saintmisty", resource_type: resourceType },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

// Get all media (public)
router.get("/", async (_req, res) => {
  try {
    const media = await Media.find().sort({ date: -1 });
    res.json(media);
  } catch (err) {
    logger.error("Failed to fetch media:", err);
    res.status(500).json({ error: "Failed to fetch media" });
  }
});

// Get a single media item by ID (public)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });
    const media = await Media.findById(id);
    if (!media) return res.status(404).json({ error: "Not found" });
    res.json(media);
  } catch (err) {
    logger.error("Failed to fetch media:", err);
    res.status(500).json({ error: "Failed to fetch media" });
  }
});

// Upload file to Cloudinary (protected)
router.post("/upload", requireAuth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const { title, type, videoUrl, date } = req.body;
    if (!title || !type) return res.status(400).json({ error: "Title and type are required" });

    const sanitizedTitle = sanitizeHtml(title, { allowedTags: [], allowedAttributes: {} });

    const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype);

    const mediaData = {
      title: sanitizedTitle,
      type,
      url: result.secure_url,
      cloudinaryId: result.public_id,
      date: date || new Date(),
    };

    if (type === "video") {
      mediaData.thumbnail = result.secure_url;
      mediaData.videoUrl = videoUrl || "";
    }

    const media = new Media(mediaData);
    await media.save();
    res.status(201).json(media);
  } catch (err) {
    logger.error("Failed to upload file:", err);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

// Create a media item with a URL (protected) — kept for legacy/manual entries
router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, type, url, thumbnail, videoUrl, date } = req.body;
    if (!title || !type || !url) return res.status(400).json({ error: "Title, type, and URL are required" });

    const sanitizedTitle = sanitizeHtml(title, { allowedTags: [], allowedAttributes: {} });
    const media = new Media({ title: sanitizedTitle, type, url, thumbnail, videoUrl, date });
    await media.save();
    res.status(201).json(media);
  } catch (err) {
    logger.error("Failed to create media:", err);
    res.status(500).json({ error: "Failed to create media" });
  }
});

// Update a media item (protected)
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });

    const { title, type, url, thumbnail, videoUrl, date } = req.body;
    const sanitizedTitle = sanitizeHtml(title, { allowedTags: [], allowedAttributes: {} });

    const updated = await Media.findByIdAndUpdate(
      id,
      { title: sanitizedTitle, type, url, thumbnail, videoUrl, date },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Not found" });

    res.json(updated);
  } catch (err) {
    logger.error("Failed to update media:", err);
    res.status(500).json({ error: "Failed to update media" });
  }
});

// Delete a media item + remove from Cloudinary (protected)
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });

    const media = await Media.findByIdAndDelete(id);
    if (!media) return res.status(404).json({ error: "Not found" });

    if (media.cloudinaryId) {
      const resourceType = media.type === "video" ? "video" : "image";
      await cloudinary.uploader.destroy(media.cloudinaryId, { resource_type: resourceType });
    }

    res.status(204).send();
  } catch (err) {
    logger.error("Failed to delete media:", err);
    res.status(500).json({ error: "Failed to delete media" });
  }
});

module.exports = router;
