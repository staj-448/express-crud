// Import dependencies
const express = require("express");
const mongoose = require("mongoose");
const playerRoutes = require("./routes/players");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Built-in body parser
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/players", playerRoutes);

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/Packers") // change DB name if needed
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    process.exit(1); // Exit if DB connection fails
  });
