const express = require('express');
const bodyparser = require('body-parser');
var cors = require('cors')
const path = require('path')
const fs = require('fs')
const swaggerUi = require('swagger-ui-express');
const YAML = require('yaml');

const dotenv = require('dotenv');
const chats = require('./data/data');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')
const socketEvent = require('./constant/socket');

const file  = fs.readFileSync('./swagger.yaml', 'utf8')
const swaggerDocument = YAML.parse(file)


dotenv.config();

connectDB();
const app = express();
app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyparser.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


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

const PORT = process.env.PORT || 4000


const server = app.listen(PORT, console.log(`server is running on port ${PORT}`));


const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
      origin: process.env.CLIENT_SOCKET_URL,
       credentials: true,
    },
  });

  io.on("connection", (socket) => {
        socket.on(socketEvent.SETUP, (userData) => {
            
            socket.join(userData._id);
            socket.emit(socketEvent.CONNECTED);
        });

        socket.on(socketEvent.JOIN_CHAT, (room) => {
            socket.join(room)
        })

        socket.on(socketEvent.NEW_MESSAGE, (newMessageRecieved) => {
            var chat = newMessageRecieved.chat;
        
            if (!chat.users) return
        
            chat.users.forEach((user) => {
              if (user._id == newMessageRecieved.sender._id) return;
        
              socket.in(user._id).emit(socketEvent.MESSAGE_RECIEVED, newMessageRecieved);
            });
          }); 

        socket.on(socketEvent.TYPING, (roomId) => {
          socket.in(roomId).emit(socketEvent.TYPING)
        })

        socket.on(socketEvent.STOP_TYPING, (roomId) => {
          socket.in(roomId).emit(socketEvent.STOP_TYPING)
        })

        socket.off(socketEvent.SETUP, () => {
          socket.leave(userData._id);
        });
  });


