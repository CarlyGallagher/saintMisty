const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String, // could hold a URL or file path
    },
    video: {
      type: String, // URL to video (YouTube, Vimeo, etc.)
    },
    links: {
      type: [String], // Array of URLs
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);