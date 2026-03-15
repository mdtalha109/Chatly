const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const PDFDocument = require("../models/pdfDocumentModel");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    throw new ApiError(400, "something went wrong")
  }

  
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.status(200).json(new ApiResponse(200, "chat", isChat[0], true))
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(new ApiResponse(200, "chat found", FullChat, true));
    } catch (error) {
      res.status(400);
      throw new ApiError(400, "something went wrong");
    }
  }
});

//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected
const fetchChats = asyncHandler(async (req, res) => {
  try {
  Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
  .populate("users", "-password")
  .populate("groupAdmin", "-password")
  .populate("latestMessage")
  .then(async (results) => {

    results.sort((a, b) => {
      const dateA = a.latestMessage?.createdAt
        ? new Date(a.latestMessage.createdAt).getTime()
        : 0;

      const dateB = b.latestMessage?.createdAt
        ? new Date(b.latestMessage.createdAt).getTime()
        : 0;

      return dateB - dateA;
    });

    results = await User.populate(results, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    res
      .status(200)
      .send(new ApiResponse(200, "chat fetched successfully!", results, true));
  });
  } catch (error) {
    
    throw new ApiError(400, "something went wrong")
  }
});

//@description     Create New Group Chat
//@route           POST /api/chat/group
//@access          Protected
const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    throw new ApiError(400, "Please Fill all the feilds")
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
      throw new ApiError(400, "More than 2 users are required to form a group chat")
  }

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

    res.status(200).json(new ApiResponse(200, "group created", fullGroupChat, true));

  } catch (error) {
    throw new ApiError("Error in creating group chat, Please try again!")
  }
});

// @desc    Rename Group
// @route   PUT /api/chat/rename
// @access  Protected
const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    throw new ApiError(400, "Chat Not Found");
  } else {
    res.status(new ApiResponse(200, "Chat renamed successfully", updatedChat, true));
  }
});

// @desc    Remove user from Group
// @route   PUT /api/chat/groupremove
// @access  Protected
const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new ApiError(400, "Chat Not Found");
  } else {
    res.status(new ApiResponse(200, "removed group successfully", removed, true));
  }
});

// @desc    Add user to Group / Leave
// @route   PUT /api/chat/groupadd
// @access  Protected
const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new ApiError(400, "Chat Not Found");
  } else {
    res.json();
    res.status(new ApiResponse(200, "added to group successfully", added, true));
  }
});

//@description     Create PDF Chat
//@route           POST /api/chat/pdf/create
//@access          Protected
const createPdfChat = asyncHandler(async (req, res) => {
  const { pdfDocumentId } = req.body;

  if (!pdfDocumentId) {
    throw new ApiError(400, "PDF document ID is required");
  }

  // Verify pdfDocumentId exists
  const pdfDocument = await PDFDocument.findById(pdfDocumentId);
  if (!pdfDocument) {
    throw new ApiError(404, "PDF document not found");
  }

  // get ai user from the db (it will act as second person in the chat)
  const aiUser = await User.findOne({ email: "ai@assistant.internal" });
  if (!aiUser) {
    throw new ApiError(404, "AI user not found. Please run the seed script to create AI user.");
  }
  
  let existingChat = await Chat.findOne({
    chatType: 'pdf',
    pdfDocument: pdfDocumentId,
    users: { $all: [req.user._id, aiUser._id] }
  })
    .populate("users", "-password")
    .populate("pdfDocument");

  if (existingChat) {
    return res.status(200).json(
      new ApiResponse(
        200,
        "PDF chat already exists",
        existingChat,
        true
      )
    );
  }

  // Create new PDF chat
  const chatData = {
    chatName: `Chat with ${pdfDocument.fileName}`,
    isGroupChat: false,
    chatType: 'pdf',
    users: [req.user._id, aiUser._id],
    pdfDocument: pdfDocumentId
  };

  try {
    const createdChat = await Chat.create(chatData);
    const fullChat = await Chat.findOne({ _id: createdChat._id })
      .populate("users", "-password")
      .populate("pdfDocument");

    res.status(201).json(
      new ApiResponse(
        201,
        "PDF chat created successfully",
        fullChat,
        true
      )
    );
  } catch (error) {
    throw new ApiError(400, "Error creating PDF chat: " + error.message);
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  createPdfChat,
};