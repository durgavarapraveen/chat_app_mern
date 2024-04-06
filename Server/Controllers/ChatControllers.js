const Chat = require("../Models/ChatModel");
const User = require("../Models/UserModel");
const mongoose = require("mongoose");

const accessChatController = async (req, res) => {
  const { userId } = req.body;

  if (!userId)
    return res.status(201).send({
      success: false,
      message: "User ID is required",
    });

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: userId } } },
      { users: { $elemMatch: { $eq: req.user._id } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name profilePic email",
  });

  if (isChat.length > 0) {
    return res.status(200).send({
      success: true,
      chat: isChat[0],
    });
  } else {
    var ChatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [userId, req.user._id],
    };

    try {
      const newChat = await Chat.create(ChatData);

      const FullChat = await Chat.findOne({ _id: newChat._id }).populate(
        "users",
        "-password"
      );

      res.status(200).send({
        success: true,
        chat: FullChat,
      });
    } catch (err) {
      return res.status(500).send({
        success: false,
        message: err.message,
      });
    }
  }
};

const getChatController = async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name profilePic email",
        });

        res.status(200).send({
          success: true,
          chats: results,
        });
      });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

const createGroupChatController = async (req, res) => {
  var users = JSON.parse(req.body.users);

  if (!users || !req.body.name) {
    return res.status(201).send({ message: "Please Fill all the feilds" });
  }

  if (users.length < 2) {
    return res
      .status(201)
      .send("More than 2 users are required to form a group chat");
  }

  // Push the current user to the users array
  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });


    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

const renameGroupChatController = async (req, res) => {
  const { chatId, chatName } = req.body;

  const Updatedchat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName: chatName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!Updatedchat) {
    return res.status(201).send({
      success: false,
      message: "Chat not found",
    });
  }

  res.status(200).send({
    success: true,
    chat: Updatedchat,
  });
};

const addMemberController = async (req, res) => {
  const { chatId, userId } = req.body;

  if (!chatId || !userId) {
    return res.status(201).send({
      success: false,
      message: "Please provide chatId and userId",
    });
  }

  const userPresent = await Chat.find({
    _id: chatId,
    users: { $elemMatch: { $eq: userId } },
  });


  // if (userPresent) {
  //   return res.status(201).send({
  //     success: false,
  //     message: "User already present",
  //   });
  // }

  const AddedUser = await Chat.findByIdAndUpdate(
    chatId,
    { $push: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!AddedUser) {
    return res.status(201).send({
      success: false,
      message: "User not added",
    });
  }

  res.status(200).send({
    success: true,
    chat: AddedUser,
  });
};

const removeMemberController = async (req, res) => {
  const { chatId, userId } = req.body;

  if (!chatId || !userId) {
    return res.status(201).send({
      success: false,
      message: "Please provide chatId and userId",
    });
  }

  const noUser = await Chat.find({
    _id: chatId,
    users: { $elemMatch: { $eq: userId } },
  });


  if (noUser == "") {
    return res.status(201).send({
      success: false,
      message: "User not present in the chat",
    });
  }

  const RemovedUser = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!RemovedUser) {
    return res.status(201).send({
      success: false,
      message: "User not removed",
    });
  }

  res.status(200).send({
    success: true,
    chat: RemovedUser,
  });
};

const deleteGroupChatController = async (req, res) => {
  const { chatId } = req.body;

  if (!chatId) {
    return res.status(201).send({
      success: false,
      message: "Please provide chatId",
    });
  }

  const DeletedChat = await Chat.findByIdAndDelete(chatId);

  if (!DeletedChat) {
    return res.status(201).send({
      success: false,
      message: "Chat not deleted",
    });
  }

  res.status(200).send({
    success: true,
    chat: DeletedChat,
    message: "Chat Deleted",
  });
};

module.exports = {
  accessChatController,
  getChatController,
  createGroupChatController,
  renameGroupChatController,
  addMemberController,
  removeMemberController,
  deleteGroupChatController,
};
