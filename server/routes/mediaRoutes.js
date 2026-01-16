const express = require("express");
const multer = require("multer");
const path = require("path");
const sanitizeHtml = require("sanitize-html");
const Media = require("../models/media");
const mongoose = require("mongoose");
const { requireAuth } = require("../middleware/authMiddleware");
const logger = require("../utils/logger");

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image and video files are allowed"));
    }
  },
});

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

// Upload file endpoint (protected)
router.post("/upload", requireAuth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { title, type, videoUrl, date } = req.body;

    if (!title || !type) {
      return res.status(400).json({ error: "Title and type are required" });
    }

    // Sanitize title
    const sanitizedTitle = sanitizeHtml(title, { allowedTags: [], allowedAttributes: {} });

    // Generate URL for the uploaded file
    const fileUrl = `/uploads/${req.file.filename}`;

    const mediaData = {
      title: sanitizedTitle,
      type,
      date: date || new Date(),
    };

    if (type === "photo") {
      mediaData.url = fileUrl;
    } else if (type === "video") {
      mediaData.thumbnail = fileUrl;
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

// Create a new media item with URL (protected)
router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, type, url, thumbnail, videoUrl, date } = req.body;

    if (!title || !type || !url) {
      return res.status(400).json({ error: "Title, type, and URL are required" });
    }

    // Sanitize title
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

    // Sanitize title
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

// Delete a media item (protected)
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });

    const deleted = await Media.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Not found" });

    res.status(204).send();
  } catch (err) {
    logger.error("Failed to delete media:", err);
    res.status(500).json({ error: "Failed to delete media" });
  }
});

module.exports = router;
