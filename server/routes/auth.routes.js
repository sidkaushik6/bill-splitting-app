const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { validationResult } = require("express-validator");
const {
  validateUsername,
  validateEmail,
  validatePassword,
} = require("../utils/validations");

//router.post('/register', authController.register);
//router.post('/login', authController.login);

//Register route
router.post(
  "/register",
  [validateUsername, validateEmail, validatePassword],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  authController.register
);

// Login route
router.post(
  "/login",
  (req, res, next) => {
    // To implement Basic validation to ensure email and password are provided
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  authController.login
);

module.exports = router;
