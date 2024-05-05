const User = require("../models/user.model");

exports.sendFriendRequest = async (req, res) => {
  try {
    const { userId } = req.params; //This user id is Recipient's ObjectId in DB
    // const senderId = req.body.senderId;
    const senderId = req.userId; //Authenticated UserId as sender

    // Add sender to the recipient's friend requests
    const recipient = await User.findById(userId);
    recipient.friendRequests.push(senderId);
    await recipient.save();

    res.status(200).json({ message: "Friend request sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    //const userId = req.body.userId;
    const userId = req.userId; // Authenticated userId of accepter

    // Remove the request from the recipient's friend requests
    const recipient = await User.findByIdAndUpdate(
      userId,
      { $pull: { friendRequests: requestId } },
      { new: true }
    );

    // Add the sender and recipient as friends
    recipient.friends.push(requestId);
    // Save the recipient to persist the change
    await recipient.save();

    const sender = await User.findByIdAndUpdate(
      requestId,
      { $push: { friends: userId } },
      { new: true }
    );

    res.status(200).json({ message: "Friend request accepted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.rejectFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.body.userId;

    // Remove the request from the recipient's friend requests
    const recipient = await User.findByIdAndUpdate(
      userId,
      { $pull: { friendRequests: requestId } },
      { new: true }
    );

    res.status(200).json({ message: "Friend request rejected successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.getFriends = async (req, res) => {
  try {
    const userId = req.userId; // the authenticated user's ID
    const user = await User.findById(userId).populate(
      "friends",
      "name username email"
    );

    if (!user) {
      // In case userId doesn't lead to a valid user, Some external JWT
      return res.status(404).json({ message: "User not found" });
    }

    if (user.friends.length === 0) {
      // Check if the user has no friends
      return res.status(200).json({ message: "User has no friends yet" });
    }

    //Structured Response
    const response = {
      friends: user.friends,
      totalFriends: user.friends.length, //metadata
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error retrieving friends:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.removeFriend = async (req, res) => {
  try {
    const { friendId } = req.params; // The ID of the friend to be removed
    const userId = req.userId; // Authenticated user's ID

    // Find the authenticated user and remove the friend from their list
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { friends: friendId } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the friend and remove the authenticated user from their list
    const friend = await User.findByIdAndUpdate(
      friendId,
      { $pull: { friends: userId } },
      { new: true }
    );

    if (!friend) {
      return res.status(404).json({ message: "Friend not found" });
    }

    res.status(200).json({ message: "Friend removed successfully" });
  } catch (error) {
    console.error("Error removing friend:", error);
    res
      .status(500)
      .json({
        message: "An unexpected error occurred while removing the friend",
      });
  }
};

exports.viewFriendRequests = async (req, res) => {
  try {
    const userId = req.userId; // The authenticated user's ID

    const user = await User.findById(userId).populate(
      "friendRequests",
      "name username email"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.friendRequests.length === 0) {
      // Check if the user has no friends Requests
      return res
        .status(200)
        .json({ message: "User has no friend requests yet" });
    }

  
    const response = {
      friendRequests: user.friendRequests,
      totalFriendRequests: user.friendRequests.length, //metadata
    };

    // Return the list of friend requests
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching friend requests:", error); 
    res.status(500).json({ message: "An unexpected error occurred" });
  }
};
