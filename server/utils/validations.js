const { body } = require("express-validator");

const validatePassword = [
  body("password")
    .isLength({ min: 5, max: 11 })
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/)
    .withMessage(
      "Password must be between 5 and 11 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
    ),
];

const validateTitle = [
  body("title")
    .isLength({ min: 1, max: 50 })
    .withMessage("Title must be between 1 and 100 characters long"),
];

const validateEmail = [
  body("email")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((value) => {
      if (value.includes(" ")) {
        throw new Error("Email address should not contain spaces");
      }
      return true;
    }),
];

const validateUsername = [
  body("username")
    .isAlphanumeric()
    .withMessage(
      "Username should be alphanumeric and should not contain spaces"
    )
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 and 20 characters long"),
];

const normalizeTitle = (title) => {
  return title.trim().toLowerCase().replace(/\s+/g, "_");
};

module.exports = {
  validatePassword,
  validateTitle,
  validateEmail,
  validateUsername,
  normalizeTitle,
};
