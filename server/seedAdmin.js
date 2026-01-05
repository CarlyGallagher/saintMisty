const mongoose = require("mongoose");
const User = require("./models/user");
require("dotenv").config();

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existing = await User.findOne({ email: "admin@saintmisty.com" });
    if (existing) {
      console.log("❌ Admin user already exists");
      process.exit(0);
    }

    // Create admin user
    const admin = new User({
      email: "admin@saintmisty.com",
      password: "admin123",  // Change this to a secure password!
      name: "Saint Misty Admin",
    });

    await admin.save();
    console.log("✅ Admin user created successfully");
    console.log("Email: admin@saintmisty.com");
    console.log("Password: admin123");
    console.log("\n⚠️  Please change this password in production!");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

seedAdmin();
