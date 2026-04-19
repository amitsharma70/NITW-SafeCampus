const User = require("../models/User");

/* Search user by email */
exports.searchUser = async (req, res) => {
  try {
    const { email } = req.query;

    const user = await User.findOne({ email }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

/* Get friend list */
exports.getFriends = async (req, res) => {
  try {
    const { userId } = req.query;

    const user = await User.findById(userId)
      .populate("friends", "-password");

    res.json(user.friends);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

/* Add friend */
exports.addFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.body;

    if (userId === friendId) {
      return res.status(400).json({ message: "Cannot add yourself" });
    }

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!friend) {
      return res.status(404).json({ message: "Friend not found" });
    }

    if (user.friends.includes(friendId)) {
      return res.status(400).json({ message: "Already friends" });
    }

    user.friends.push(friendId);
    friend.friends.push(userId);

    await user.save();
    await friend.save();

    res.json({ message: "Friend added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

/* Remove friend */
exports.removeFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.body;

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    user.friends = user.friends.filter(
      (id) => id.toString() !== friendId
    );

    friend.friends = friend.friends.filter(
      (id) => id.toString() !== userId
    );

    await user.save();
    await friend.save();

    res.json({ message: "Friend removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};