const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const logger = require("./utils/logger");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow images to load
}));

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: "Too many login attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static("uploads"));

// Request logging middleware (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    logger.debug(`${req.method} ${req.url}`);
    next();
  });
}

const blogRoutes = require("./routes/blogRoutes");
const authRoutes = require("./routes/authRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const showRoutes = require("./routes/showRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");

app.use("/api/blogs", blogRoutes);
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/shows", showRoutes);
app.use("/api/newsletter", newsletterRoutes);

// --- Example Route ---
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    logger.info("Connected to MongoDB");
    app.listen(PORT, () =>
      logger.info(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => logger.error("MongoDB connection error:", err));

