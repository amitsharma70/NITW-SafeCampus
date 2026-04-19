const express = require("express");
const router = express.Router();

const {
  getFriends,
  addFriend,
  removeFriend,
} = require("../controllers/friendController");

router.get("/list", getFriends);
router.post("/add", addFriend);
router.post("/remove", removeFriend);

module.exports = router;