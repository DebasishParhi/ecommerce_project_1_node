const express = require('express');
require("./db/config");

const cors = require("cors");
const jwt = require("jsonwebtoken");
const User = require('./db/users');
const crypto = require("crypto");

const app = express();

app.use(express.json());
app.use(cors());

// Generate secret only once per server start
const JWT_SECRET =  crypto.randomBytes(64).toString("hex");

app.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    const result = await user.save();

    // Create JWT token
    const token = jwt.sign(
      {
        userId: result._id,
        email: result.email
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
        algorithm: "HS256"
      }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        _id: result._id,
        email: result.email
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message
    });
  }
});


app.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-__v"); // exclude __v field

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});