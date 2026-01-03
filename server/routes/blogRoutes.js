// server/routes/blogRoutes.js
const express = require("express");
const Blog = require("../models/blog");
const mongoose = require("mongoose");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new blog post (protected)
router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, content, image } = req.body;
    const blog = new Blog({ title, content, image });
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
    console.error(err);
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

// Update a blog post (protected)
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });

    const { title, content, image } = req.body;
    if (!title || !content) return res.status(400).json({ error: "Title and content are required" });

    const updated = await Blog.findByIdAndUpdate(
      id,
      { title, content, image },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Not found" });

    res.json(updated);
  } catch (err) {
    console.error(err);
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
    console.error(err);
    res.status(500).json({ error: "Failed to delete blog post" });
  }
});

module.exports = router;