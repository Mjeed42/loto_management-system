const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

// Adjust this path to match your project structure
const User = require("../src/models/User");

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://loto_app_user:6hsMKn4SwqFKpPtV@loto-cluster.e2qnwyn.mongodb.net/loto-app?retryWrites=true&w=majority";

// Path to your uploaded CSV
const CSV_PATH = path.join(__dirname, "employees.csv");

async function hashPassword(plain) {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(plain, salt);
}

async function importEmployees() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected successfully");

    // Optional: Clear existing users? (Uncomment if needed)
    // await User.deleteMany({});
    // console.log("🧹 Existing users cleared");

    const users = [];
    console.log(`📄 Reading ${CSV_PATH}...`);

    // Parse CSV
    const parsedRows = await new Promise((resolve, reject) => {
      const rows = [];
      fs.createReadStream(CSV_PATH)
        .pipe(csv())
        .on("data", (data) => rows.push(data))
        .on("end", () => resolve(rows))
        .on("error", reject);
    });

    console.log(`✅ Parsed ${parsedRows.length} employees`);

    // Process each row
    for (const row of parsedRows) {
      const {
        Username,
        Email,
        Password,
        Role,
        "First Name": FirstName,
        "Last Name": LastName,
        "Employee ID": EmployeeID,
      } = row;

      if (!Username || !Password || !Role || !EmployeeID) {
        console.warn(`⚠️ Skipping invalid row:`, { Username, EmployeeID });
        continue;
      }

      const hashedPassword = await hashPassword(Password.trim());

      users.push({
        username: Username.trim(),
        email: Email && Email !== "null@null.com" ? Email.trim() : `${Username.trim()}@company.com`,
        password: hashedPassword,
        role: Role.trim().toLowerCase(), // 'supervisor' or 'technician'
        firstName: FirstName.trim(),
        lastName: LastName.trim(),
        employeeId: EmployeeID.trim(),
        isActive: true,
      });
    }

    console.log(`\n🔐 Preparing to create ${users.length} users...`);

    // Save users one by one (to catch individual errors)
    let success = 0;
    for (const user of users) {
      try {
        const newUser = new User(user);
        await newUser.save();
        console.log(`✅ Created: ${user.username} (${user.role})`);
        success++;
      } catch (err) {
        if (err.code === 11000) {
          console.warn(`⚠️ Duplicate user skipped: ${user.username}`);
        } else {
          console.error(`❌ Failed to create ${user.username}:`, err.message);
        }
      }
    }

    console.log(`\n🎉 Done! ${success} users imported successfully.`);
    process.exit(0);
  } catch (error) {
    console.error("💥 Fatal error:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

importEmployees();
