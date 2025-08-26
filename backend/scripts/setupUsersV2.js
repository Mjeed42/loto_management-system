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
  isActive: Boolean,
});

const User = mongoose.model("User", userSchema);

async function setupUsersV2() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      "mongodb://admin:securepassword123@loto_mongodb:27017/loto_management?authSource=admin"
    );
    console.log("Connected to MongoDB");

    // Update existing "admin" user to "manager"
    const oldAdmin = await User.findOne({ username: "admin" });
    if (oldAdmin) {
      oldAdmin.role = "manager";
      oldAdmin.firstName = "System";
      oldAdmin.lastName = "Manager";
      await oldAdmin.save();
      console.log("Updated admin user to manager role");
    }

    // Check if admin user already exists
    const adminExists = await User.findOne({ username: "systemadmin" });
    if (!adminExists) {
      // Create new admin user
      const adminUser = new User({
        username: "systemadmin",
        email: "admin@lotosystem.com",
        password: await bcrypt.hash("admin123!", 12),
        firstName: "System",
        lastName: "Administrator",
        role: "admin",
        isActive: true,
      });
      await adminUser.save();
      console.log("Created new admin user: systemadmin");
    } else {
      console.log("Admin user already exists");
    }

    // Create some sample technicians if they don't exist
    const sampleTechnicians = [
      {
        username: "tech1",
        email: "tech1@company.com",
        password: await bcrypt.hash("tech123", 12),
        firstName: "John",
        lastName: "Technician",
        role: "technician",
      },
      {
        username: "tech2",
        email: "tech2@company.com",
        password: await bcrypt.hash("tech123", 12),
        firstName: "Jane",
        lastName: "Engineer",
        role: "technician",
      },
    ];

    for (const techData of sampleTechnicians) {
      const existingTech = await User.findOne({ username: techData.username });
      if (!existingTech) {
        const user = new User(techData);
        await user.save();
        console.log(`Created technician: ${user.username}`);
      }
    }

    console.log("User setup completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error setting up users:", error);
    process.exit(1);
  }
}

setupUsersV2();
