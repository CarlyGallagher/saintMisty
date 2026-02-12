const express = require("express");
const Presave = require("../models/presave");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

// Get the current pre-save (public)
router.get("/", async (_req, res) => {
  try {
    const presave = await Presave.findOne();
    if (!presave) return res.status(404).json({ error: "No pre-save configured" });
    res.json(presave);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch pre-save" });
  }
});

// Update or create the pre-save (protected, singleton upsert)
router.put("/", requireAuth, async (req, res) => {
  try {
    const { songName, text, url } = req.body;
    if (!songName || !text || !url) {
      return res.status(400).json({ error: "Song name, text, and URL are required" });
    }

    const presave = await Presave.findOneAndUpdate(
      {},
      { songName, text, url },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(presave);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update pre-save" });
  }
});

// Delete the pre-save (protected)
router.delete("/", requireAuth, async (_req, res) => {
  try {
    const presave = await Presave.findOneAndDelete();
    if (!presave) return res.status(404).json({ error: "No pre-save to delete" });
    res.json({ message: "Pre-save deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete pre-save" });
  }
});

module.exports = router;
