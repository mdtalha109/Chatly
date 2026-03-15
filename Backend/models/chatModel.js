const mongoose = require('mongoose');

const chatModel = mongoose.Schema({
    chatName: {
        type: String, 
        trim: true
    },

    isGroupChat: {
        type: Boolean,
        default: false
    },

    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    latestMessage : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    },
    
    groupAdmin : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    chatType: { type: String, enum: ['regular', 'pdf'], default: 'regular' },
    pdfDocument: { type: mongoose.Schema.Types.ObjectId, ref: "PDFDocument" }
}, {
    timeStamps: true
})

const Chat = mongoose.model("Chat", chatModel)

module.exports = Chat


