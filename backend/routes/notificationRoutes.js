const express = require("express");
const router = express.Router();

const {
  getNotifications,
  markAllAsRead,
} = require("../controllers/notificationController");

router.get("/:userId", getNotifications);
router.post("/read-all", markAllAsRead);

module.exports = router;