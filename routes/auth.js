const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
// Create a user using POST: "/api/auth/" . Doesn't require authentication
router.post(
  "/",
  [
    body("email", 'Enter a valid email').isEmail(),
    body("name", 'Please enter a valid ').isLength({ min: 3 }),
    body("password", 'password must be of 6 letters').isLength({ min: 6 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    User.create({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
      }).then(user => res.json(user)).catch(err => console.log(err))
      res.json({error: 'please enter a unique email'});
  }
);

module.exports = router;
