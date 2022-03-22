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
const path = require('path')

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

//Deployement

const __dirname1 = path.resolve()


if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname1, "../frontend/build")));

  app.get('*', (req, res)=> {
    res.sendFile(path.resolve(__dirname1, "frontend","build","index.html"))
  })
}
else{
  app.get('/', (req, res) => {
    res.send('API running')
  })
}


const PORT = process.env.PORT || 5000


const server = app.listen(PORT, console.log(`server is running on port ${process.env.PORT}`));


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
          
            socket.join(userData._id);
            socket.emit("connected");
        });

        socket.on('join chat', (room) => {
            socket.join(room)
        })

        socket.on("new message", (newMessageRecieved) => {
            var chat = newMessageRecieved.chat;
        
            if (!chat.users) return console.log("chat.users not defined");
        
            chat.users.forEach((user) => {
              if (user._id == newMessageRecieved.sender._id) return;
        
              socket.in(user._id).emit("message recieved", newMessageRecieved);
            });
          }); 

          socket.off("setup", () => {
            console.log("USER DISCONNECTED");
            socket.leave(userData._id);
          });
  });


