const express = require('express');
const dotenv = require('dotenv');
const chats = require('./data/data');

const app = express();
dotenv.config();

app.get('/', (req, res) => {
    res.end('Chatly server created!');
}); 

app.get('/api/chat', (req, res) => {
    res.send(chats)
});

app.get('/api/chat/:id', (req, res) => {
    const singleChat = chats.find(c => c._id === req.params.id);
    res.send(singleChat);
});

app.listen(process.env.PORT, console.log("server is started"));