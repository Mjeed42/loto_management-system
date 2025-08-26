const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Simple user schema for the script
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  role: String,
});

const User = mongoose.model("User", userSchema);

async function createTestTechnicians() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      "mongodb://admin:securepassword123@loto_mongodb:27017/loto_management?authSource=admin"
    );
    console.log("Connected to MongoDB");

    // Check if technicians already exist
    const existingTechCount = await User.countDocuments({ role: "technician" });
    if (existingTechCount >= 10) {
      console.log("Test technicians already exist. Skipping creation.");
      process.exit(0);
    }

    // Create 10 test technicians
    const technicians = [];
    const firstNames = [
      "John",
      "Jane",
      "Mike",
      "Sarah",
      "David",
      "Lisa",
      "Robert",
      "Emily",
      "James",
      "Patricia",
    ];
    const lastNames = [
      "Smith",
      "Johnson",
      "Williams",
      "Brown",
      "Jones",
      "Garcia",
      "Miller",
      "Davis",
      "Rodriguez",
      "Martinez",
    ];

    for (let i = 1; i <= 10; i++) {
      technicians.push({
        username: `tech${i}`,
        email: `tech${i}@company.com`,
        password: await bcrypt.hash("tech123", 12),
        firstName: firstNames[i - 1] || `Tech${i}`,
        lastName: lastNames[i - 1] || `User`,
        role: "technician",
      });
    }

    // Insert technicians
    for (const techData of technicians) {
      const existingUser = await User.findOne({
        $or: [{ username: techData.username }, { email: techData.email }],
      });

      if (!existingUser) {
        const user = new User(techData);
        await user.save();
        console.log(
          `Created technician: ${user.firstName} ${user.lastName} (${user.username})`
        );
      } else {
        console.log(`Technician ${techData.username} already exists`);
      }
    }

    console.log("Test technicians created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error creating technicians:", error);
    process.exit(1);
  }
}

createTestTechnicians();
