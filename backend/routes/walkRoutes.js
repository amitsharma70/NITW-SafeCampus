const express = require("express");
const router = express.Router();

const {
  startWalk,
  completeWalk,
  getActiveWalk,
} = require("../controllers/walkController");

router.post("/start", startWalk);
router.post("/complete", completeWalk);
router.get("/active/:userId", getActiveWalk);

module.exports = router;