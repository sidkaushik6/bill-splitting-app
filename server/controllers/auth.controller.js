
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

exports.register = async (req, res) => {
    try {

      const { name, username, email, password } = req.body;

      // Checks if the user already exists
      const existingUser = await User.findOne({
        $or: [{ username }, { email }],
      });
      if (existingUser) {
        return res.status(400).json({
          message:
            "Username or email already exists. Please choose another one.",
        });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create a new user
      const newUser = new User({
        name,
        username,
        email,
        password: hashedPassword,
      });
      await newUser.save();

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  };

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Checks if the user exists
    const user = await User.findOne({ email });
    console.log("User:", user);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a JSON Web Token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "5h",
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Something went wrong" + error });
  }
};
