const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');

// Use your MongoDB Atlas connection string
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://<YOUR_ATLAS_USERNAME>:<YOUR_ATLAS_PASSWORD>@<YOUR_CLUSTER>.xxxxx.gcp.mongodb.net/loto_management?retryWrites=true&w=majority&appName=LOTO-App";

async function fixUserCreation() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Clear existing users
    await User.deleteMany({});
    console.log('🧹 Cleared existing users');

    // Users to create with plain text passwords (will be hashed by Mongoose)
    const usersToCreate = [
      {
        username: "systemadmin",
        email: "admin@example.com",
        password: process.env.ADMIN_PASSWORD || "admin123!", // Use environment variable
        firstName: "System",
        lastName: "Administrator",
        employeeId: "EMP001",
        role: "admin",
        isActive: true
      },
      {
        username: "plantmanager",
        email: "manager@example.com",
        password: process.env.MANAGER_PASSWORD || "manager123", // Use environment variable
        firstName: "Plant",
        lastName: "Manager",
        employeeId: "EMP002",
        role: "manager",
        isActive: true
      }
    ];

    // Add 10 technicians
    for (let i = 1; i <= 10; i++) {
      const paddedNum = i.toString().padStart(2, '0');
      usersToCreate.push({
        username: `tech${paddedNum}`,
        email: `tech${paddedNum}@example.com`,
        password: process.env.TECH_PASSWORD || "tech123", // Use environment variable
        firstName: "Technician",
        lastName: `${paddedNum}`,
        employeeId: `EMP${(i + 2).toString().padStart(3, '0')}`,
        role: "technician",
        isActive: true
      });
    }

    // Create users through Mongoose (passwords will be automatically hashed)
    for (const userData of usersToCreate) {
      try {
        console.log(`Creating user: ${userData.username} (${userData.role})`);

        const user = new User(userData);
        await user.save();

        console.log(`✅ Created user: ${user.username} with hashed password`);
      } catch (err) {
        console.error(`❌ Error creating user ${userData.username}:`, err.message);
      }
    }

    console.log('🎉 All users created successfully with hashed passwords!');

    // Verify users were created
    const users = await User.find().select('username email role isActive employeeId');
    console.log('\n📋 Users in database:');
    users.forEach(user => {
      console.log(`  - ${user.username} (${user.role}) - Employee ID: ${user.employeeId} - Active: ${user.isActive}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('💥 Error:', error);
    process.exit(1);
  }
}

fixUserCreation();
