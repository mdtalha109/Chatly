const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");


const allMessages = asyncHandler(async (req, res) => {
  try { 

    let messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat")
      .sort({ createdAt:-1 })
      messages = messages.sort((a,b) => a.createdAt - b.createdAt)

    res.status(200).json(new ApiResponse(200, "Messages fetched successfully", messages, true));

  } catch (error) {

    console.log("error: ", error)
    throw new ApiError(400, "Something went wrong while fetching messages");
    
  }
});


const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId, image } = req.body;


  if (!chatId || (!content && !image)) {
    throw new ApiError(400, "Message in empty!")
  }

  const newMessage = {
    sender: req.user._id,
    content,
    image,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
    res.status(200).json(new ApiResponse(200, "Message sent sucessfully", message, true));

  } catch (error) {
    res.status(400);
    throw new ApiError("Error in sending message, Please try again")
  }
});

module.exports = { allMessages, sendMessage };