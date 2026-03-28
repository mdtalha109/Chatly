const PDFDocument = require("../models/pdfDocumentModel");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const cloudinary = require("cloudinary").v2;
const { processPDF, queryPDF } = require("../services/langchainService");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'talhapro321',
  api_key: process.env.CLOUDINARY_API_KEY || '635686547261266',
  api_secret: process.env.CLOUDINARY_API_SECRET || '5MBkvs7lpibiRimZBUJbQf12wdE',
});

exports.uploadPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Create DB record with status 'pending' (before processing)
    const pdfDoc = await PDFDocument.create({
      pdfUrl: null, // Will be set after Cloudinary upload
      fileName: req.file.originalname,
      fileSize: req.file.size,
      cloudinaryId: null,
      uploadedBy: req.user._id,
      metadata: {
        processingStatus: 'pending',
        pineconeNamespace: null,
        totalChunks: null,
        embeddingModel: null,
      }
    });

    try {
      const { chunkCount, embeddingModel } = await processPDF(
        req.file.path,
        pdfDoc._id.toString()
      );

      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "raw",
        folder: "pdfs",
      });

      console.log("Cloudinary upload result:", result);

      pdfDoc.pdfUrl = result.secure_url;
      pdfDoc.cloudinaryId = result.public_id;
      pdfDoc.metadata = {
        processingStatus: 'completed',
        totalChunks: chunkCount,
        embeddingModel: embeddingModel,
        pineconeNamespace: pdfDoc._id.toString(),
      };
      await pdfDoc.save();

      console.log(`PDF processed successfully: ${chunkCount} chunks`);

      res.status(201).json({
        success: true,
        message: "PDF uploaded and processed successfully",
        data: {
          pdfDocumentId: pdfDoc._id,
          pdfUrl: pdfDoc.pdfUrl,
          fileName: pdfDoc.fileName,
          fileSize: pdfDoc.fileSize,
          totalChunks: chunkCount,
          processingStatus: 'completed',
        }
      });
    } catch (processingError) {
      console.error("Error processing PDF:", processingError.message);
      
      pdfDoc.metadata = {
        ...pdfDoc.metadata,
        processingStatus: 'failed',
      };
      await pdfDoc.save();

      res.status(201).json({
        success: true,
        message: "PDF uploaded but processing failed",
        data: {
          pdfDocumentId: pdfDoc._id,
          pdfUrl: pdfDoc.pdfUrl,
          fileName: pdfDoc.fileName,
          fileSize: pdfDoc.fileSize,
          processingStatus: 'failed',
          error: processingError.message,
        }
      });
    }
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

/**
 * Query PDF using RAG
 * POST /api/pdf/query
 * Body: { chatId, question, stream }
 * Query param: ?stream=true for streaming mode
 */
exports.queryPdf = async (req, res) => {
  try {
    const { chatId, question } = req.body;
    const streamMode = req.query.stream === 'true' || req.body.stream === true;

    if (!chatId || !question) {
      return res.status(400).json({
        success: false,
        message: "chatId and question are required"
      });
    }

    // Get chat and verify it's a PDF chat
    const chat = await Chat.findById(chatId).populate("pdfDocument");
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found"
      });
    }

    if (chat.chatType !== 'pdf' || !chat.pdfDocument) {
      return res.status(400).json({
        success: false,
        message: "This is not a PDF chat"
      });
    }

    const pdfDoc = chat.pdfDocument;

    // Verify PDF processing completed
    if (pdfDoc.metadata?.processingStatus !== 'completed') {
      return res.status(400).json({
        success: false,
        message: `PDF processing is ${pdfDoc.metadata?.processingStatus || 'pending'}. Please wait.`
      });
    }

    // Get AI user
    const aiUser = await User.findOne({ email: "ai@assistant.internal" });
    if (!aiUser) {
      return res.status(500).json({
        success: false,
        message: "AI user not found"
      });
    }

    let userMessage = await Message.create({
      sender: req.user._id,
      content: question,
      chat: chatId,
      isAIResponse: false,
    });

    userMessage = await userMessage.populate("sender", "name pic");
    userMessage = await userMessage.populate("chat");
    userMessage = await User.populate(userMessage, {
      path: "chat.users",
      select: "name pic email",
    });

    console.log("User message stored:", userMessage);

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: userMessage,
    });

    // Handle streaming mode
    if (streamMode) {
      // Set headers for Server-Sent Events
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // Send initial event with user message
      res.write(`data: ${JSON.stringify({ 
        type: 'start', 
        userMessage 
      })}\n\n`);

      let fullAnswer = '';
      let tokenUsage = {};

      try {
        // Query PDF with streaming
        console.log(`[STREAM] Querying PDF ${pdfDoc._id} with question: ${question}`);
        
        const result = await queryPDF(pdfDoc._id.toString(), question, {
          stream: true,
          onChunk: (chunk) => {
            // Send each chunk to client
            console.log('[STREAM] Sending chunk:', chunk);
            res.write(`data: ${JSON.stringify({ 
              type: 'chunk', 
              content: chunk 
            })}\n\n`);
          }
        });

        fullAnswer = result.answer;
        tokenUsage = result.tokenUsage;

        // Store complete AI response in database
        const aiMessage = await Message.create({
          sender: aiUser._id,
          content: fullAnswer,
          chat: chatId,
          isAIResponse: true,
        });

        // Update chat's latest message
        await Chat.findByIdAndUpdate(chatId, {
          latestMessage: aiMessage,
        });

        await aiMessage.populate("sender", "name pic email");

        // Send final event with complete message and token usage
        res.write(`data: ${JSON.stringify({ 
          type: 'done', 
          aiMessage,
          tokenUsage 
        })}\n\n`);

        res.end();
      } catch (streamError) {
        console.error('[STREAM] Error:', streamError);
        res.write(`data: ${JSON.stringify({ 
          type: 'error', 
          message: streamError.message 
        })}\n\n`);
        res.end();
      }
    } else {
      // Regular non-streaming mode
      console.log(`Querying PDF ${pdfDoc._id} with question: ${question}`);
      const result = await queryPDF(pdfDoc._id.toString(), question);
      const aiAnswer = result.answer;
      const tokenUsage = result.tokenUsage;

      // Store AI response
      const aiMessage = await Message.create({
        sender: aiUser._id,
        content: aiAnswer,
        chat: chatId,
        isAIResponse: true,
      });

      // Update chat's latest message
      await Chat.findByIdAndUpdate(chatId, {
        latestMessage: aiMessage,
      });

      await aiMessage.populate("sender", "name pic email");

      res.status(200).json({
        success: true,
        message: "Query processed successfully",
        data: {
          userMessage,
          aiMessage,
          tokenUsage,
        }
      });
    }
  } catch (error) {
    console.error("Query error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
