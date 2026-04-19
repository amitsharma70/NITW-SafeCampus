const WalkSession = require("../models/WalkSession");
const Notification = require("../models/Notification");
const User = require("../models/User");

/* Start Walk */
exports.startWalk = async (req, res) => {
  try {
    const { userId, destination, duration } = req.body;

    const startTime = new Date();
    const expiresAt = new Date(
      Date.now() + duration * 60 * 1000
    );

    const walk = await WalkSession.create({
      userId,
      destination,
      duration,
      startTime,
      expiresAt,
      status: "active",
    });
    const user = await User.findById(userId).populate("friends");
    
        // Create notification for each friend
        for (const friend of user.friends) {
          await Notification.create({
            userId: friend._id,
            type: "SOS",
            message: `${user.name} Stareted a wlak with me session`,
            referenceId: walk._id,
          });
        }

    res.json(walk);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

/* Complete Walk */
exports.completeWalk = async (req, res) => {
  try {
    const { walkId } = req.body;

    const walk = await WalkSession.findById(walkId);

    if (!walk) {
      return res.status(404).json({ message: "Walk not found" });
    }

    walk.status = "completed";
    await walk.save();

    res.json({ message: "Walk completed safely" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

/* Get Active Walk */
exports.getActiveWalk = async (req, res) => {
  try {
    const { userId } = req.params;

    const walk = await WalkSession.findOne({
      userId,
      status: "active",
    });

    res.json(walk);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

/* Update Live Location */
exports.updateLocation = async (req, res) => {
  try {
    const { walkId, lat, lng } = req.body;

    await WalkSession.findByIdAndUpdate(walkId, {
      lastLocation: { lat, lng },
    });

    res.json({ message: "Location updated" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};