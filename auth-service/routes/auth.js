const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../db/connection");
const kafkaProducer = require("../kafka/producer")();
const router = express.Router();

// POST /register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Insert user into the database
    const result = await db.query(
      "INSERT INTO Users (username, email, password) VALUES ($1, $2, $3) RETURNING id",
      [username, email, password]
    );

    // Publish Kafka event
    kafkaProducer("user-events", {
      type: "USER_REGISTERED",
      userId: result.rows[0].id,
      username,
      email,
    });

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// POST /login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Retrieve the user from the database
    const { rows } = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = rows[0];

    // Check if the user exists and password matches
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Save token in the database
    await db.query(
      "INSERT INTO tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
      [user.id, token, new Date(Date.now() + 3600000)] // 1 hour from now
    );

    // Publish Kafka event
    kafkaProducer("user-events", {
      type: "USER_LOGGED_IN",
      userId: user.id,
      email,
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;