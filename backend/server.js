const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
// Add after the auth routes
app.use("/api/loto", require("./src/routes/loto"));
// Add after the loto routes
app.use("/api/users", require("./src/routes/users"));
// Add after the users routes
app.use("/api/notifications", require("./src/routes/notifications"));

// Database Connection - FIXED VERSION
const MONGO_URI = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => {
    console.log("MongoDB Connection Error:", err);
    console.log("Connection String:", MONGO_URI);
  });

// Routes
app.use("/api/auth", require("./src/routes/auth"));

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "LOTO Backend API is running!" });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
