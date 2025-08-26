const mongoose = require("mongoose");
const User = require("../src/models/User");
require("dotenv").config();

// Connect to database
mongoose
  .connect(
    `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// Test users
const testUsers = [
  {
    username: "admin",
    email: "admin@company.com",
    password: "admin123",
    firstName: "System",
    lastName: "Administrator",
    employeeId: "EMP001",
    role: "admin",
  },
  {
    username: "tech",
    email: "tech@company.com",
    password: "tech123",
    firstName: "John",
    lastName: "Technician",
    employeeId: "EMP002",
    role: "technician",
  },
  {
    username: "supervisor",
    email: "supervisor@company.com",
    password: "supervisor123",
    firstName: "Jane",
    lastName: "Supervisor",
    employeeId: "EMP003",
    role: "supervisor",
  },
];

const createUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});

    // Create test users
    for (const userData of testUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`Created user: ${user.username} (${user.role})`);
    }

    console.log("All test users created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error creating users:", error);
    process.exit(1);
  }
};

createUsers();
