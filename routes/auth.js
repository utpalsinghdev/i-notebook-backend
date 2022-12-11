const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// Create a user using POST: "/api/auth/createuser" . No login required.

router.post(
  "/createuser",
  [
    body("email", "Enter a valid email").isEmail(),
    body("name", "Please enter a valid ").isLength({ min: 3 }),
    body("password", "password must be of 6 letters").isLength({ min: 6 }),
  ],
  async (req, res) => {
    // If there are no errors, return bad req and the errors

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check weather the user with email exist already

    try {
      let user = await User.findOne({ email: req.body.email });

      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry the user with this email is already exists" });
      }

      //Create a new user with encryption credentials

      const salt = await bcrypt.genSalt(10);
      secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, "JWT_SECRET");

      console.log(authToken);
      // res.json(user);
      res.json({ authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("some error occurred");
    }
  }
);

// Authenticate a user using: post "/api/auth/login" No login required

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password can't be blank").exists(),
  ],
  async (req, res) => {
    //If there are errors, return bad request and the erros

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return (
          res.status(400).json({ error: "Please enter the real email address" })
        );
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        res.status(400).json({ error: "Please enter the real password" });
      }

      const data = {
        user:{
          id: user.id,
        }
      }
      const authToken = jwt.sign(data, "JWT_SECRET")
      res.json({authToken})
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error occurred");
    }
  }
);
module.exports = router;
