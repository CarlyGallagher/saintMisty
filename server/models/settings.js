const mongoose = require("mongoose");

// Singleton document holding site-wide toggles controlled from the admin dashboard
const settingsSchema = new mongoose.Schema(
  {
    promoEnabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
