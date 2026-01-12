const express = require("express");
const Show = require("../models/show");
const mongoose = require("mongoose");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all shows (public)
router.get("/", async (_req, res) => {
  try {
    const shows = await Show.find().sort({ createdAt: -1 });
    res.json(shows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch shows" });
  }
});

// Get a single show by ID (public)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });

    const show = await Show.findById(id);
    if (!show) return res.status(404).json({ error: "Not found" });

    res.json(show);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch show" });
  }
});

// Create a new show (protected)
router.post("/", requireAuth, async (req, res) => {
  try {
    const { date, time, venue, city, ticketUrl } = req.body;

    if (!date || !time || !venue || !city || !ticketUrl) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const show = new Show({ date, time, venue, city, ticketUrl });
    await show.save();
    res.status(201).json(show);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create show" });
  }
});

// Update a show (protected)
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });

    const { date, time, venue, city, ticketUrl } = req.body;

    const updated = await Show.findByIdAndUpdate(
      id,
      { date, time, venue, city, ticketUrl },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Not found" });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update show" });
  }
});

// Delete a show (protected)
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });

    const deleted = await Show.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Not found" });

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete show" });
  }
});

module.exports = router;
