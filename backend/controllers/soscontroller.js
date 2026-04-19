const SOSAlert = require("../models/SOSAlert");
const Notification = require("../models/Notification");
const User = require("../models/User");

/* Send SOS */
exports.sendSOS = async (req, res) => {
  try {
    const { userId, lat, lng, message } = req.body;

    // Create SOS entry
    const sos = await SOSAlert.create({
      userId,
      location: { lat, lng },
      message,
    });

    // Find user and friends
    const user = await User.findById(userId).populate("friends");

    // Create notification for each friend
    for (const friend of user.friends) {
      await Notification.create({
        userId: friend._id,
        type: "SOS",
        message: `${user.name} sent an SOS alert!`,
        referenceId: sos._id,
      });
    }

    res.json({ message: "SOS sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

/* Get SOS history of a user */
exports.getUserSOS = async (req, res) => {
  try {
    const { userId } = req.params;

    const sosList = await SOSAlert.find({ userId }).sort({
      createdAt: -1,
    });

    res.json(sosList);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};