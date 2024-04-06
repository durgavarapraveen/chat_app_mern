const express = require("express");
const protect = require("../Middleware/authMiddleware");
const {
  accessChatController,
  getChatController,
  createGroupChatController,
  renameGroupChatController,
  addMemberController,
  removeMemberController,
  deleteGroupChatController,
} = require("../Controllers/ChatControllers");

const router = express.Router();

router.post("/getChat", protect, accessChatController);

router.get("/", protect, getChatController);

router.post("/creategroup", protect, createGroupChatController);

router.put("/renamegrp", protect, renameGroupChatController);

router.put("/addmember", protect, addMemberController);

router.put("/removemember", protect, removeMemberController);

router.delete("/deletegrp", protect, deleteGroupChatController);

module.exports = router;
