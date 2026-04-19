const Notification = require("../models/Notification");

/* Get notifications of user */
exports.getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

/* Mark all notifications as read */
exports.markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.body;

    await Notification.updateMany(
      { userId, read: false },
      { read: true }
    );

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};