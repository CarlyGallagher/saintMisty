const express = require("express");
const Settings = require("../models/settings");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

// Get site settings (public — the client needs to know whether to show the promo)
router.get("/", async (_req, res) => {
  try {
    const settings = await Settings.findOne();
    res.json({ promoEnabled: settings ? settings.promoEnabled : true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

// Update site settings (protected, singleton upsert)
router.put("/", requireAuth, async (req, res) => {
  try {
    const { promoEnabled } = req.body;
    if (typeof promoEnabled !== "boolean") {
      return res.status(400).json({ error: "promoEnabled must be true or false" });
    }

    const settings = await Settings.findOneAndUpdate(
      {},
      { promoEnabled },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    res.json({ promoEnabled: settings.promoEnabled });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update settings" });
  }
});

module.exports = router;
