const express = require("express");
const router = express.Router();

const {
  getUserById,
  getAllUsers,
} = require("../controllers/userController");

router.get("/", getAllUsers);
router.get("/:userId", getUserById);

module.exports = router;