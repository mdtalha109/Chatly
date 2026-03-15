const mongoose = require('mongoose');

const pdfDocumentSchema = mongoose.Schema({
  pdfUrl: { type: String, required: false },
  fileName: { type: String, required: true },
  fileSize: { type: Number },
  cloudinaryId: { type: String },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  
  // LangChain metadata
  metadata: {
    totalChunks: { type: Number },
    embeddingModel: { type: String },
    pineconeNamespace: { type: String },
    processingStatus: { 
      type: String, 
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    }
  }
}, { timestamps: true });

const PDFDocument = mongoose.model("PDFDocument", pdfDocumentSchema);
module.exports = PDFDocument;