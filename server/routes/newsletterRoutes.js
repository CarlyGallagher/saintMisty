const express = require("express");
const crypto = require("crypto");
const mongoose = require("mongoose");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const Subscriber = require("../models/subscriber");
const nodemailer = require("nodemailer");
const { requireAuth } = require("../middleware/authMiddleware");
const { renderNewsletter, MAX_IMAGES } = require("../utils/newsletterTemplate");

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) return cb(null, true);
    cb(new Error("Only image files are allowed"));
  },
});

// Each subscriber's preferences/unsubscribe links carry a signed token, so nobody can
// change someone else's settings by guessing ids
const linkToken = (id) =>
  crypto.createHmac("sha256", process.env.JWT_SECRET || "").update(`unsubscribe:${id}`).digest("hex");

const validToken = (id, token) => {
  if (!mongoose.isValidObjectId(id)) return false;
  const expected = Buffer.from(linkToken(id));
  const given = Buffer.from(String(token || ""));
  return expected.length === given.length && crypto.timingSafeEqual(expected, given);
};

const stripSlash = (url) => (url || "").replace(/\/+$/, "");

// The one-click unsubscribe header points at this API (Render sits behind a proxy, hence x-forwarded-proto)
const apiBaseUrl = (req) =>
  stripSlash(process.env.PUBLIC_SERVER_URL) ||
  `${(req.get("x-forwarded-proto") || req.protocol).split(",")[0]}://${req.get("host")}`;

const siteUrl = () => stripSlash(process.env.CLIENT_URL) || "https://www.saintmisty.com";

const linksFor = (req, subscriber) => {
  const token = linkToken(subscriber._id);
  const preferencesUrl = `${siteUrl()}/email-preferences/${subscriber._id}/${token}`;
  return {
    preferencesUrl,
    unsubscribeUrl: `${preferencesUrl}?unsubscribe=1`,
    oneClickUrl: `${apiBaseUrl(req)}/api/newsletter/unsubscribe/${subscriber._id}/${token}`,
  };
};

const VALID_INTERESTS = ["music", "merch", "shows"];

const SEND_GAP_MS = 600;
const RETRY_DELAY_MS = 2000;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// A short, readable reason from a mail error (no credentials are ever in these)
const providerReason = (err) =>
  String(err?.response || err?.message || "unknown error").split("\n")[0].slice(0, 200);

// Only keep up to MAX_IMAGES https URLs
const cleanImages = (images) =>
  (Array.isArray(images) ? images : [])
    .filter((url) => typeof url === "string" && /^https:\/\//.test(url))
    .slice(0, MAX_IMAGES);

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
    const interests = Array.isArray(req.body.interests)
      ? [...new Set(req.body.interests.filter((i) => VALID_INTERESTS.includes(i)))]
      : [];

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Check if already subscribed
    const existing = await Subscriber.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: "Already subscribed" });
    }

    const subscriber = new Subscriber({ email, name, interests });
    await subscriber.save();
    res.status(201).json({ message: "Subscribed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to subscribe" });
  }
});

// Upload a photo for a newsletter (protected). Returns its public URL.
router.post("/images", requireAuth, (req, res) => {
  imageUpload.single("image")(req, res, async (uploadErr) => {
    if (uploadErr) {
      const tooBig = uploadErr.code === "LIMIT_FILE_SIZE";
      return res.status(400).json({ error: tooBig ? "Photos must be under 10MB" : uploadErr.message });
    }
    if (!req.file) return res.status(400).json({ error: "No photo uploaded" });

    try {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "saintmisty/newsletter",
              resource_type: "image",
              // Keep emails light: cap the size and let Cloudinary pick the format and quality
              transformation: [{ width: 1200, crop: "limit", quality: "auto", fetch_format: "auto" }],
            },
            (error, uploaded) => (error ? reject(error) : resolve(uploaded))
          )
          .end(req.file.buffer);
      });
      res.status(201).json({ url: result.secure_url });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to upload photo" });
    }
  });
});

// Render the email exactly as it will be sent (protected)
router.post("/preview", requireAuth, (req, res) => {
  const { message, images } = req.body;
  res.json({
    html: renderNewsletter({ message, images: cleanImages(images), preferencesUrl: "#", unsubscribeUrl: "#" }),
  });
});

// Send newsletter (protected). Goes to the hand-picked subscribers in recipientIds
// when given, otherwise to a segment.
router.post("/send", requireAuth, async (req, res) => {
  try {
    const { subject, message, segment } = req.body;
    const recipientIds = Array.isArray(req.body.recipientIds) ? [...new Set(req.body.recipientIds.map(String))] : [];
    const images = cleanImages(req.body.images);

    if (!subject || !message) {
      return res.status(400).json({ error: "Subject and message are required" });
    }

    let subscribers;
    if (recipientIds.length) {
      if (!recipientIds.every((id) => mongoose.isValidObjectId(id))) {
        return res.status(400).json({ error: "Invalid recipient" });
      }
      subscribers = await Subscriber.find({ _id: { $in: recipientIds } });
      if (subscribers.length === 0) {
        return res.status(404).json({
          error: recipientIds.length === 1 ? "That subscriber no longer exists." : "Those subscribers no longer exist.",
        });
      }
    } else {
      const SEGMENTS = ["all", "music", "merch", "shows"];
      const target = segment || "all";
      if (!SEGMENTS.includes(target)) {
        return res.status(400).json({ error: "Invalid segment" });
      }

      // "all" goes to everyone. A specific segment goes to subscribers who chose it,
      // plus those with no recorded categories (they're treated as signed up for everything).
      const filter =
        target === "all"
          ? {}
          : {
              $or: [
                { interests: target },
                { interests: { $size: 0 } },
                { interests: { $exists: false } },
              ],
            };
      subscribers = await Subscriber.find(filter);

      if (subscribers.length === 0) {
        return res.status(400).json({
          error: target === "all"
            ? "No subscribers found. Add subscribers first before sending newsletters."
            : `No subscribers found for ${target}.`
        });
      }
    }

    // Configure email transporter (using environment variables)
    // EMAIL_HOST switches to any SMTP provider (e.g. Resend: smtp.resend.com, port 465).
    // Without it, sending goes through EMAIL_SERVICE (Gmail by default).
    // One pooled connection, so emails go out one after another instead of all at once.
    const auth = { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD };
    const port = Number(process.env.EMAIL_PORT) || 465;
    const transporter = nodemailer.createTransport({
      ...(process.env.EMAIL_HOST
        ? { host: process.env.EMAIL_HOST, port, secure: port === 465 }
        : { service: process.env.EMAIL_SERVICE || "gmail" }),
      auth,
      pool: true,
      maxConnections: 1,
    });

    // EMAIL_FROM lets the newsletter go out from a separate sending address
    // (e.g. a dedicated no-reply inbox) instead of the login account
    const fromAddress = process.env.EMAIL_FROM || process.env.EMAIL_USER;
    if (!fromAddress || !fromAddress.includes("@")) {
      return res.status(500).json({ error: "Email isn't set up yet: EMAIL_FROM needs to be a sending address." });
    }
    const from = `"${process.env.EMAIL_FROM_NAME || "Saint Misty"}" <${fromAddress}>`;

    // Each email gets its own preferences and unsubscribe links
    const sendTo = (subscriber) => {
      const { preferencesUrl, unsubscribeUrl, oneClickUrl } = linksFor(req, subscriber);
      return transporter.sendMail({
        from,
        ...(process.env.EMAIL_REPLY_TO ? { replyTo: process.env.EMAIL_REPLY_TO } : {}),
        to: subscriber.email,
        subject: subject,
        html: renderNewsletter({ message, images, preferencesUrl, unsubscribeUrl }),
        list: { unsubscribe: { url: oneClickUrl, comment: "Unsubscribe" } },
        headers: { "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
      });
    };

    // Resend accepts about 2 emails per second, so send one at a time with a short gap
    // and retry a failed one once after a pause. Failures are collected rather than
    // stopping the whole send, so it's clear exactly who didn't get it.
    const failed = [];
    let lastError;
    try {
      for (let i = 0; i < subscribers.length; i++) {
        if (i > 0) await wait(SEND_GAP_MS);
        try {
          await sendTo(subscribers[i]);
        } catch (firstErr) {
          await wait(RETRY_DELAY_MS);
          try {
            await sendTo(subscribers[i]);
          } catch (err) {
            console.error(`Newsletter to ${subscribers[i].email} failed:`, err);
            lastError = err;
            failed.push(subscribers[i].email);
          }
        }
      }
    } finally {
      transporter.close();
    }

    const sent = subscribers.length - failed.length;

    if (sent === 0) {
      return res.status(500).json({
        error: `Nothing was sent. The email provider said: ${providerReason(lastError)}`,
      });
    }

    if (failed.length > 0) {
      // Some went out: report success with the misses, so nobody resends to everyone
      return res.json({
        message: `Sent to ${sent} of ${subscribers.length}. These didn't go through: ${failed.join(", ")} (${providerReason(lastError)})`,
        count: sent,
        failed,
      });
    }

    res.json({
      message:
        subscribers.length === 1 && recipientIds.length
          ? `Email sent to ${subscribers[0].email}`
          : recipientIds.length
            ? `Sent to ${subscribers.length} selected subscribers`
            : `Newsletter sent successfully to ${subscribers.length} subscribers`,
      count: subscribers.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send newsletter" });
  }
});

// Load a subscriber's email settings from the link in their email (public, signed)
router.get("/preferences/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  if (!validToken(id, token)) return res.status(400).json({ error: "This link isn't valid." });
  try {
    const subscriber = await Subscriber.findById(id);
    if (!subscriber) return res.status(404).json({ error: "You're not subscribed anymore." });
    res.json({ email: subscriber.email, interests: subscriber.interests || [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load your preferences" });
  }
});

// Update which emails a subscriber gets (public, signed)
router.put("/preferences/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  if (!validToken(id, token)) return res.status(400).json({ error: "This link isn't valid." });

  const interests = Array.isArray(req.body.interests)
    ? [...new Set(req.body.interests.filter((i) => VALID_INTERESTS.includes(i)))]
    : [];
  if (interests.length === 0) {
    return res.status(400).json({ error: "Pick at least one, or unsubscribe instead." });
  }

  try {
    const subscriber = await Subscriber.findByIdAndUpdate(id, { interests }, { new: true });
    if (!subscriber) return res.status(404).json({ error: "You're not subscribed anymore." });
    res.json({ email: subscriber.email, interests: subscriber.interests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save your preferences" });
  }
});

// Unsubscribe (public, signed). Used by the preferences page and by the
// one-click unsubscribe button Gmail and Apple Mail show.
router.post("/unsubscribe/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  if (!validToken(id, token)) return res.status(400).json({ error: "This link isn't valid." });
  try {
    await Subscriber.findByIdAndDelete(id);
    res.json({ message: "Unsubscribed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to unsubscribe" });
  }
});

// Put back subscribers that were just deleted (protected). Used by "Undo" in the admin.
// They keep their original id, so the preferences and unsubscribe links in emails
// they already have still work.
router.post("/subscribers/restore", requireAuth, async (req, res) => {
  const list = Array.isArray(req.body.subscribers) ? req.body.subscribers.slice(0, 1000) : [];
  if (list.length === 0) return res.status(400).json({ error: "Nothing to restore" });

  const restored = [];
  const skipped = [];
  try {
    for (const item of list) {
      const email = typeof item?.email === "string" ? item.email.trim().toLowerCase() : "";
      if (!mongoose.isValidObjectId(item?._id) || !email.includes("@")) {
        skipped.push(email || "unknown");
        continue;
      }
      // Already back (e.g. they signed up again in the meantime): leave the current record alone
      if (await Subscriber.exists({ $or: [{ _id: item._id }, { email }] })) {
        skipped.push(email);
        continue;
      }
      const subscribedAt = new Date(item.subscribedAt);
      const subscriber = await Subscriber.create({
        _id: item._id,
        email,
        ...(typeof item.name === "string" && item.name.trim() ? { name: item.name } : {}),
        interests: Array.isArray(item.interests)
          ? [...new Set(item.interests.filter((i) => VALID_INTERESTS.includes(i)))]
          : [],
        ...(isNaN(subscribedAt) ? {} : { subscribedAt }),
      });
      restored.push(subscriber);
    }
    res.json({ restored, skipped });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to restore subscribers", restored, skipped });
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
