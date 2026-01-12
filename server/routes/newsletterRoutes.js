const express = require("express");
const Subscriber = require("../models/subscriber");
const nodemailer = require("nodemailer");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all subscribers (protected)
router.get("/subscribers", requireAuth, async (_req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ subscribedAt: -1 });
    res.json(subscribers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch subscribers" });
  }
});

// Add a new subscriber (public - for the subscribe form on the site)
router.post("/subscribe", async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Check if already subscribed
    const existing = await Subscriber.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: "Already subscribed" });
    }

    const subscriber = new Subscriber({ email, name });
    await subscriber.save();
    res.status(201).json({ message: "Subscribed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to subscribe" });
  }
});

// Send newsletter (protected)
router.post("/send", requireAuth, async (req, res) => {
  try {
    const { subject, message, segment } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ error: "Subject and message are required" });
    }

    // Get subscribers
    const subscribers = await Subscriber.find();

    if (subscribers.length === 0) {
      return res.status(400).json({
        error: "No subscribers found. Add subscribers first before sending newsletters."
      });
    }

    // Configure email transporter (using environment variables)
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Send emails
    const emailPromises = subscribers.map((subscriber) => {
      return transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: subscriber.email,
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #ff1493;">Saint Misty Newsletter</h2>
            <div style="line-height: 1.6; color: #333;">
              ${message.replace(/\n/g, "<br>")}
            </div>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
            <p style="font-size: 12px; color: #888;">
              You're receiving this because you subscribed to Saint Misty's mailing list.
            </p>
          </div>
        `,
      });
    });

    await Promise.all(emailPromises);

    res.json({
      message: `Newsletter sent successfully to ${subscribers.length} subscribers`,
      count: subscribers.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send newsletter" });
  }
});

// Delete a subscriber (protected)
router.delete("/subscribers/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Subscriber.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Not found" });

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete subscriber" });
  }
});

module.exports = router;
