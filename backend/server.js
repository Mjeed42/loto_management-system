const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();

// Middleware
app.use(helmet());

// CORS configuration to support credentials (cookies)
const allowedOrigins = [
  "https://loto-frontend-643788243736.europe-west1.run.app", // Production frontend
  "http://localhost:3000", // Local development
  "http://localhost:3001", // Alternative local port
  "http://127.0.0.1:3000", // Alternative localhost
];

// Add custom origin from environment variable if provided
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies to be sent
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser()); // Parse cookies

// Routes
app.use("/api/loto", require("./src/routes/loto"));
app.use("/api/users", require("./src/routes/users"));
app.use("/api/notifications", require("./src/routes/notifications"));
app.use("/api/admin", require("./src/routes/admin"));
app.use("/api/auth", require("./src/routes/auth"));
// Add after other routes
app.use("/api/locations", require("./src/routes/locations"));
app.use("/api/energy-types", require("./src/routes/energyTypes"));

// Database Connection - MongoDB Atlas with DEBUG
console.log("=== MONGODB CONNECTION DEBUG ===");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);
console.log(
  "MONGODB_URI length:",
  process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0
);

// Direct connection string (for testing)
const MONGO_URI =
  "mongodb+srv://loto_app_user:6hsMKn4SwqFKpPtV@loto-cluster.e2qnwyn.mongodb.net/loto-app?retryWrites=true&w=majority";
process.env.MONGODB_URI ||
  "mongodb+srv://loto_app_user:6hsMKn4SwqFKpPtV@loto-cluster.e2qnwyn.mongodb.net/loto-app?retryWrites=true&w=majority";

console.log("Using connection string:", MONGO_URI.replace(/:[^:@]+@/, ":***@")); // Hide password in logs

// MongoDB connection options
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000, // Increased timeout
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  bufferCommands: false,
  bufferMaxEntries: 0,
};

console.log("Connection options:", mongoOptions);
console.log("Attempting to connect to MongoDB Atlas...");

mongoose
  .connect(MONGO_URI, mongoOptions)
  .then(() => {
    console.log("✅ MongoDB Atlas Connected Successfully");
    console.log("Database name:", mongoose.connection.name);
    console.log("Connection host:", mongoose.connection.host);
    console.log("Connection state:", mongoose.connection.readyState);
  })
  .catch((err) => {
    console.error("❌ MongoDB Atlas Connection Error:");
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);
    console.error("Error code:", err.code);
    console.error("Full error:", err);

    // Try alternative connection methods
    console.log("\n=== TRYING ALTERNATIVE CONNECTION ===");
    tryAlternativeConnection();
  });

// Alternative connection function
async function tryAlternativeConnection() {
  try {
    console.log("Trying connection without options...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Alternative connection successful!");
  } catch (err) {
    console.error("❌ Alternative connection also failed:", err.message);

    // Try with minimal options
    try {
      console.log("Trying with minimal options...");
      await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("✅ Minimal options connection successful!");
    } catch (err2) {
      console.error("❌ All connection attempts failed");
      console.error("Final error:", err2.message);
    }
  }
}

// Handle MongoDB connection events
mongoose.connection.on("connecting", () => {
  console.log("🔄 Mongoose connecting to MongoDB Atlas...");
});

mongoose.connection.on("connected", () => {
  console.log("✅ Mongoose connected to MongoDB Atlas");
});

mongoose.connection.on("open", () => {
  console.log("📂 Mongoose connection opened");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ Mongoose connection error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("❌ Mongoose disconnected from MongoDB Atlas");
});

mongoose.connection.on("reconnected", () => {
  console.log("🔄 Mongoose reconnected to MongoDB Atlas");
});

// Test database operations
mongoose.connection.once("open", async () => {
  try {
    console.log("\n=== TESTING DATABASE OPERATIONS ===");
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(
      "Available collections:",
      collections.map((c) => c.name)
    );

    // Test a simple operation
    const admin = mongoose.connection.db.admin();
    const result = await admin.ping();
    console.log("Database ping result:", result);

    console.log("✅ Database operations test successful!");
  } catch (err) {
    console.error("❌ Database operations test failed:", err.message);
  }
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Received SIGINT, shutting down gracefully...");
  try {
    await mongoose.connection.close();
    console.log("✅ MongoDB Atlas connection closed through app termination");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during graceful shutdown:", error);
    process.exit(1);
  }
});

// Enhanced health check
app.get("/api/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const statusMap = {
    0: "Disconnected",
    1: "Connected",
    2: "Connecting",
    3: "Disconnecting",
  };

  res.status(200).json({
    message: "LOTO Backend API is running!",
    database: statusMap[dbStatus] || "Unknown",
    dbState: dbStatus,
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Express error:", err.stack);
  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(
    `📊 Health check: https://loto-backend-643788243736.europe-west1.run.app/api/health`
  );
});
