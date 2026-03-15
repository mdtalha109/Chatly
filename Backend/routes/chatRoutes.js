const express = require("express");
const { accessChat, fetchChats, createPdfChat } = require("../controller/chatController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router()

router.route('/').post(protect, accessChat)
router.route('/').get(protect, fetchChats)
router.route('/pdf/create').post(protect, createPdfChat)

module.exports = router