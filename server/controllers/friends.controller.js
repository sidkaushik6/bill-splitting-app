const User = require('../models/user.model');

exports.sendFriendRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    const senderId = req.body.senderId;
    //const senderId = req.userId; //Authenticated UserId as sender
  

    // Add sender to the recipient's friend requests
    const recipient = await User.findById(userId);
    recipient.friendRequests.push(senderId);
    await recipient.save();

    res.status(200).json({ message: 'Friend request sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.body.userId;

    // Remove the request from the recipient's friend requests
    const recipient = await User.findByIdAndUpdate(
      userId,
      { $pull: { friendRequests: requestId } },
      { new: true }
    );

    // Add the sender and recipient as friends
    recipient.friends.push(requestId);
    const sender = await User.findByIdAndUpdate(
      requestId,
      { $push: { friends: userId } },
      { new: true }
    );

    res.status(200).json({ message: 'Friend request accepted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
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

    res.status(200).json({ message: 'Friend request rejected successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.getFriends = async (req, res) => {
  try {
    const userId = req.userId; // the authenticated user's ID
    const user = await User.findById(userId).populate('friends');
    res.status(200).json(user.friends);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};
