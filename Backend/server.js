const express = require('express');
const dotenv = require('dotenv');
const chats = require('./data/data');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')
const bodyparser = require('body-parser');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
var cors = require('cors')

dotenv.config({
    path: '../.env'
});
connectDB();
const app = express();
app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyparser.urlencoded({ extended: true }));


app.use("/api/user", userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)



const server = app.listen(5000, console.log(`server is running on port 5000`));


const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:3000",
      // credentials: true,
    },
  });

  io.on("connection", (socket) => {
        console.log("Connected to socket.io");
        socket.on("setup", (userData) => {
            console.log(userData._id)
            socket.join(userData._id);
            socket.emit("connected");
        });

        socket.on('join chat', (room) => {
            socket.join(room)
            console.log('user joined room: ' + room)
        })

        socket.on("new message", (newMessageRecieved) => {
            var chat = newMessageRecieved.chat;
        
            if (!chat.users) return console.log("chat.users not defined");
        
            chat.users.forEach((user) => {
              if (user._id == newMessageRecieved.sender._id) return;
        
              socket.in(user._id).emit("message recieved", newMessageRecieved);
            });
          }); 
  });


