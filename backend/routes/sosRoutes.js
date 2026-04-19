const express = require("express");
const router = express.Router();
const {
  sendSOS,
  getUserSOS,
} = require("../controllers/sosController");

router.post("/send", sendSOS);
router.get("/user/:userId", getUserSOS);

module.exports = router;