const express = require("express");
const router = express.Router();
const protect = require("../Middleware/authMiddleware");
const {
  sendMessageController,
  getAllMessagesController,
} = require("../Controllers/MessageControllers");

router.post("/", protect, sendMessageController);

router.get("/:chatId", protect, getAllMessagesController);

module.exports = router;
