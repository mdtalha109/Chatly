const express = require('express');
const dotenv = require('dotenv');
const chats = require('./data/data');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const bodyParser = require('body-parser');

dotenv.config({
    path: '../.env'
});
connectDB();
const app = express();

app.use(express.json()); // to accept json data

app.use("/api/user", userRoutes);


app.listen(5000, console.log(`server is running on port 5000`));