const express = require('express');
const dotenv = require('dotenv');
const chats = require('./data/data');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes')
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


app.use("/api/user", userRoutes);
app.use('/api/chat', chatRoutes)



app.listen(5000, console.log(`server is running on port 5000`));