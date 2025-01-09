const express = require("express");
const dotenv = require("dotenv");
const consume = require("./kafka/consumer");

dotenv.config();

const app = express();

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "Notification Service is running" });
});

// Start Kafka consumer
consume().catch((err) => {
  console.error("Error in Kafka consumer:", err);
});

// Start server
const PORT = process.env.PORT || 6005;
app.listen(PORT, () => {
  console.log(`Notification Service is running on port ${PORT}`);
});