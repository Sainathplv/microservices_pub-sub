const express = require("express");
const bodyParser = require("body-parser");
const usersRoutes = require("./routes/users");
const kafkaConsumer = require("./kafka/consumer");

const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(bodyParser.json());

// Mount the users route
app.use("/users", usersRoutes);

// Start Kafka Consumer
kafkaConsumer().catch((err) => {
  console.error("Error starting Kafka consumer:", err);
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
});
