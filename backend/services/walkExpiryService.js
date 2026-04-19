const cron = require("node-cron");
const WalkSession = require("../models/WalkSession");
const Notification = require("../models/Notification");
const User = require("../models/User");

const startWalkExpiryJob = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      const expiredWalks = await WalkSession.find({
        status: "active",
        expiresAt: { $lte: now },
      });

      for (const walk of expiredWalks) {
        walk.status = "expired";
        await walk.save();

        const user = await User.findById(walk.userId).populate("friends");
        const securityUsers = await User.find({ role: "Security" });

        // Combine both arrays
        const recipients = [...user.friends, ...securityUsers];

        // Optional: remove duplicates (important if a friend is also Security)
        const uniqueRecipients = [
            ...new Map(recipients.map(u => [u._id.toString(), u])).values()
        ];

for (const person of uniqueRecipients) {
  await Notification.create({
    userId: person._id,
    type: "WALK_EXPIRED",
    message: `${user.name}'s walk session expired.`,
    referenceId: walk._id,
  });
}
      }

      if (expiredWalks.length > 0) {
        console.log(
          `Expired ${expiredWalks.length} walk sessions`
        );
      }
    } catch (error) {
      console.error("Walk Expiry Error:", error);
    }
  });
};

module.exports = startWalkExpiryJob;