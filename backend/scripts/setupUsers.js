const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Simple user schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  role: String,
  isActive: { type: Boolean, default: true },
});

const User = mongoose.model("User", userSchema);

async function setupUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      "mongodb://admin:securepassword123@loto_mongodb:27017/loto_management?authSource=admin"
    );
    console.log("Connected to MongoDB");

    // Clear existing users
    await User.deleteMany({});
    console.log("Cleared existing users");

    // Create users with properly hashed passwords
    const users = [
      {
        username: "admin",
        email: "admin@company.com",
        password: await bcrypt.hash("admin123", 12),
        firstName: "System",
        lastName: "Administrator",
        role: "admin",
      },
      {
        username: "tech",
        email: "tech@company.com",
        password: await bcrypt.hash("tech123", 12),
        firstName: "John",
        lastName: "Technician",
        role: "technician",
      },
    ];

    // Insert users
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      console.log(`Created user: ${user.username} (${user.role})`);
    }

    console.log("All users created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error setting up users:", error);
    process.exit(1);
  }
}

setupUsers();
