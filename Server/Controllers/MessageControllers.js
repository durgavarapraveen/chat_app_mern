const MessageModel = require("../Models/MessageModel");
const User = require("../Models/UserModel");
const ChatModel = require("../Models/ChatModel");

const sendMessageController = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res.status(201).send({
      success: false,
      message: "Please provide all required fields",
    });
  }

  var newMessage = {
    content: content,
    chat: chatId,
    sender: req.user._id,
  };

  try {
    var message = await MessageModel.create(newMessage);

    message = await message.populate("chat");

    message = await message.populate("sender", "name profilePic email");

    message = await User.populate(message, {
      path: "chat.users",
      select: "name profilePic email",
    });

    await ChatModel.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    return res.status(200).send({
      success: true,
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAllMessagesController = async (req, res) => {
  try {
    const chat = await MessageModel.find({ chat: req.params.chatId });
    const message = await MessageModel.find({ chat: req.params.chatId })
      .populate("sender", "name profilePic email")
      .populate("chat");

    res.json(message);
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  sendMessageController,
  getAllMessagesController,
};
