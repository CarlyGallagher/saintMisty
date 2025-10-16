// server/routes/blogRoutes.js
const express = require("express");
const Blog = require("../models/blog");
const mongoose = require("mongoose");

const router = express.Router();

// Create a new blog post
router.post("/", async (req, res) => {
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

router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Not found" });
    res.json(blog);
  } catch {
    res.status(400).json({ error: "Invalid id" });
  }
});

// Update a blog post
router.put("/:id", async (req, res) => {
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

// Delete a blog post
router.delete("/:id", async (req, res) => {
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