const mongoose = require("mongoose");

const presaveSchema = new mongoose.Schema(
  {
    songName: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Presave", presaveSchema);
