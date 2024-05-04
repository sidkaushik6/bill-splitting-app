const { body, param } = require("express-validator");
const User = require("../models/user.model");

// Validation to ensure a friend request doesn't already exist
const validateFriendRequest = [
  param("userId").isMongoId().withMessage("Invalid user ID"),
  async (req, res, next) => {
    try {
      const { userId } = req.params; // Recipient ID
      const senderId = req.userId; // Authenticated sender ID

      const recipient = await User.findById(userId);

      if (!recipient) {
        return res.status(404).json({ message: "Recipient not found." });
      }

      if (recipient.friendRequests.includes(senderId)) {
        return res
          .status(400)
          .json({ message: "Friend request is already pending." });
      }

      if (recipient.friends.includes(senderId)) {
        return res
          .status(400)
          .json({ message: "You are already friends with this user." });
      }

      next(); 
    } catch (error) {
      console.error("Validation error:", error);
      return res.status(500).json({ message: "Validation error occurred." });
    }
  },
];

// Validation to ensure you can accept a friend request
const validateAcceptFriendRequest = [
  param("requestId").isMongoId().withMessage("Invalid request ID"),
  async (req, res, next) => {
    try {
      const { requestId } = req.params; // ID of the user who sent the friend request
      const userId = req.userId; // Authenticated user's ID

      const recipient = await User.findById(userId);

      if (!recipient) {
        return res.status(404).json({ message: "Recipient not found." });
      }

      if (recipient.friends.includes(requestId)) {
        return res
          .status(400)
          .json({ message: "You are already friends with this user." });
      }

      next(); 
    } catch (error) {
      console.error("Validation error:", error);
      return res.status(500).json({ message: "Validation error occurred." });
    }
  },
];

module.exports = {
  validateFriendRequest,
  validateAcceptFriendRequest,
};
