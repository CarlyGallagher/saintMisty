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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);