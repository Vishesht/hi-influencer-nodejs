const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet"); // Added for security best practices
const { errorHandler } = require("./middleware/errorHandler");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(morgan("dev")); // Logging
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://hi-influencer-web-qd5q.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(helmet()); // Secure your app by setting various HTTP headers

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    // Deprecated options removed
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Routes
const userRoutes = require("./routes/userRoutes");
app.get("/", (req, res) => res.send("Server working."));

app.use("/api", userRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
