# Chatly Backend

A real-time chat application backend with AI-powered PDF question-answering capabilities using RAG (Retrieval-Augmented Generation).

## 📋 Overview

Chatly is a full-featured chat application backend built with Node.js and Express. It provides real-time messaging through Socket.io, user authentication, and an innovative AI feature that allows users to upload PDFs and ask questions about their content using LangChain, Groq LLM, and Pinecone vector database.

## ✨ Features

- **Real-time Messaging**: Socket.io integration for instant message delivery
- **User Authentication**: JWT-based authentication and authorization
- **Chat Management**: Create, access, and manage one-on-one and group chats
- **AI-Powered PDF Q&A**: Upload PDFs and ask questions using RAG technology
  - PDF text extraction and processing
  - Vector embeddings using HuggingFace models
  - Semantic search with Pinecone vector database
  - Natural language responses powered by Groq LLM
- **User Status Tracking**: Real-time online/offline status
- **File Uploads**: Profile picture uploads via Cloudinary
- **API Documentation**: Interactive Swagger/OpenAPI documentation
- **Error Handling**: Centralized error handling middleware

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Real-time Communication**: Socket.io
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **AI/ML Stack**:
  - LangChain - AI orchestration framework
  - Groq - Large Language Model inference
  - Pinecone - Vector database for embeddings
  - HuggingFace - Text embeddings (sentence-transformers/all-mpnet-base-v2)
- **PDF Processing**: pdf-parse, pdf2json
- **File Upload**: Multer
- **Cloud Storage**: Cloudinary
- **API Documentation**: Swagger UI Express
- **Development**: Nodemon

## 📦 Prerequisites

Before running this project, ensure you have:

- Node.js (v14 or higher)
- MongoDB instance (local or cloud)
- Accounts and API keys for:
  - [Pinecone](https://www.pinecone.io/)
  - [Groq](https://groq.com/)
  - [HuggingFace](https://huggingface.co/)
  - [Cloudinary](https://cloudinary.com/)

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/mdtalha109/Chatly.git
cd Chatly/Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database
MONGO_URI=your_mongodb_connection_string

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Client Configuration
CLIENT_SOCKET_URL=http://localhost:3000

# AI Services
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=chatly-rag
GROQ_API_KEY=your_groq_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Start the server:
```bash
# Development mode with nodemon
nodemon server.js

# Production mode
node server.js
```

The server will start on `http://localhost:4000` (or your specified PORT).

## 📚 API Documentation

Once the server is running, access the interactive Swagger API documentation at:

```
http://localhost:4000/api-docs
```

### Main API Endpoints

#### Authentication & Users
- `POST /api/user` - Register a new user
- `POST /api/user/login` - Login user
- `GET /api/user?search=query` - Search users

#### Chats
- `POST /api/chat` - Create or access a one-on-one chat
- `GET /api/chat` - Fetch all chats for logged-in user
- `POST /api/chat/group` - Create a group chat
- `PUT /api/chat/rename` - Rename group chat
- `PUT /api/chat/groupadd` - Add user to group
- `PUT /api/chat/groupremove` - Remove user from group

#### Messages
- `POST /api/message` - Send a message
- `GET /api/message/:chatId` - Get all messages in a chat

#### PDF Q&A
- `POST /api/pdf/upload` - Upload and process a PDF
- `POST /api/pdf/query` - Ask questions about uploaded PDFs

All protected routes require authentication via Bearer token in the Authorization header.

## 🌐 Socket.io Events

The application uses Socket.io for real-time features:

- `setup` - Initialize user socket connection
- `connected` - Confirm connection established
- `join chat` - Join a specific chat room
- `new message` - Send/receive real-time messages
- `typing` - Indicate user is typing
- `stop typing` - Stop typing indicator
- `get user status` - Request online users
- `update user status` - Receive online users list

## 📁 Project Structure

```
Backend/
├── config/
│   ├── db.js                 # MongoDB connection
│   └── generateToken.js      # JWT token generation
├── constant/
│   └── socket.js             # Socket.io event constants
├── controller/
│   ├── chatController.js     # Chat CRUD operations
│   ├── messageController.js  # Message handling
│   ├── pdfController.js      # PDF upload and querying
│   └── userController.js     # User authentication
├── data/
│   └── data.js               # Sample data
├── middleware/
│   ├── authMiddleware.js     # JWT authentication
│   ├── errorMiddleware.js    # Error handling
│   └── uploadMiddleware.js   # Multer configuration
├── models/
│   ├── chatModel.js          # Chat schema
│   ├── messageModel.js       # Message schema
│   ├── pdfDocumentModel.js   # PDF document schema
│   └── userModel.js          # User schema
├── routes/
│   ├── chatRoutes.js         # Chat endpoints
│   ├── messageRoutes.js      # Message endpoints
│   ├── pdfRoutes.js          # PDF endpoints
│   └── userRoutes.js         # User endpoints
├── seeds/
│   └── createAIUser.js       # Seed AI user
├── services/
│   ├── langchainService.js   # LangChain RAG implementation
│   └── pdfProcessingService.js # PDF text extraction
├── uploads/                  # Temporary file uploads
├── utils/
│   ├── apiError.js           # Custom error class
│   ├── apiResponse.js        # API response formatter
│   └── asyncHandler.js       # Async error wrapper
├── server.js                 # Application entry point
├── swagger.yaml              # API documentation
├── nodemon.json              # Nodemon configuration
└── package.json              # Dependencies and scripts
```

## 🤖 AI Features Deep Dive

### PDF Question-Answering System

The application implements a RAG (Retrieval-Augmented Generation) system:

1. **PDF Upload**: User uploads a PDF document
2. **Text Extraction**: Extract text using pdf2json
3. **Text Chunking**: Split text into manageable chunks (1000 chars with 100 overlap)
4. **Embedding Generation**: Convert chunks to vector embeddings using HuggingFace
5. **Vector Storage**: Store embeddings in Pinecone vector database
6. **Query Processing**: When user asks a question:
   - Convert question to embedding
   - Perform semantic search in Pinecone
   - Retrieve relevant context chunks
   - Send context + question to Groq LLM
   - Return natural language answer

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Protected routes with auth middleware
- CORS configuration
- Environment variable protection

## 🐛 Error Handling

Centralized error handling with:
- Custom API error classes
- Async handler wrapper for route handlers
- Global error middleware
- Structured error responses

## 👨‍💻 Author

**Md Talha**

- GitHub: [@mdtalha109](https://github.com/mdtalha109)
- Project: [Chatly](https://github.com/mdtalha109/Chatly)

## 📄 License

ISC

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/mdtalha109/Chatly/issues).

## 🙏 Acknowledgments

- LangChain for the RAG framework
- Groq for fast LLM inference
- Pinecone for vector database
- HuggingFace for embedding models
- Socket.io for real-time capabilities

---

**Note**: Make sure to set up all required environment variables and API keys before running the application. Keep your `.env` file secure and never commit it to version control.
