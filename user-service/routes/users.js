const express = require("express");
const router = express.Router();
const db = require("../db/connection");

// POST /users
router.post("/", async (req, res) => {
  try {
    const {
      email,
      first_name,
      last_name,
      gender,
      date_of_birth,
      phone_number,
      password,
    } = req.body;

    // Insert the user into the database
    const result = await db.query(
      `INSERT INTO users (username, email, password, first_name, last_name, gender, date_of_birth, phone_number, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING id`,
      [
        `${first_name} ${last_name}`, // username (combined from first and last name)
        email,
        password,
        first_name,
        last_name,
        gender,
        date_of_birth,
        phone_number,
      ]
    );

    // Return the created user ID
    res.status(201).json({ message: "User created successfully", userId: result.rows[0].id });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;