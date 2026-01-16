// server/routes/blogRoutes.js
const express = require("express");
const Blog = require("../models/blog");
const mongoose = require("mongoose");
const sanitizeHtml = require("sanitize-html");
const { requireAuth } = require("../middleware/authMiddleware");
const logger = require("../utils/logger");

const router = express.Router();

// Sanitize options - allow safe HTML tags
const sanitizeOptions = {
  allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre'],
  allowedAttributes: {
    'a': ['href', 'target', 'rel']
  },
  allowedSchemes: ['http', 'https', 'mailto']
};

// Create a new blog post (protected)
router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, content, image, video, links } = req.body;

    // Sanitize inputs
    const sanitizedTitle = sanitizeHtml(title, { allowedTags: [], allowedAttributes: {} });
    const sanitizedContent = sanitizeHtml(content, sanitizeOptions);

    const blog = new Blog({
      title: sanitizedTitle,
      content: sanitizedContent,
      image,
      video,
      links
    });
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ error: "Failed to create blog post" });
  }
});

// Get all blog posts (newest first)

router.get("/", async (_req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);              // <-- must send something
  } catch (err) {
    logger.error("Failed to fetch blogs:", err);
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

// Get a single blog post by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ error: "Not found" });

    res.json(blog);
  } catch (err) {
    logger.error("Failed to fetch blog post:", err);
    res.status(500).json({ error: "Failed to fetch blog post" });
  }
});

// Update a blog post (protected)
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });

    const { title, content, image, video, links } = req.body;
    if (!title || !content) return res.status(400).json({ error: "Title and content are required" });

    // Sanitize inputs
    const sanitizedTitle = sanitizeHtml(title, { allowedTags: [], allowedAttributes: {} });
    const sanitizedContent = sanitizeHtml(content, sanitizeOptions);

    const updated = await Blog.findByIdAndUpdate(
      id,
      { title: sanitizedTitle, content: sanitizedContent, image, video, links },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Not found" });

    res.json(updated);
  } catch (err) {
    logger.error("Failed to update blog post:", err);
    res.status(500).json({ error: "Failed to update blog post" });
  }
});

// Delete a blog post (protected)
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });

    const deleted = await Blog.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Not found" });

    res.status(204).send();
  } catch (err) {
    logger.error("Failed to delete blog post:", err);
    res.status(500).json({ error: "Failed to delete blog post" });
  }
});

module.exports = router;