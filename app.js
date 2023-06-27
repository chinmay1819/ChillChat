const express = require('express');
const app = express();
const http = require('http').createServer(app)
const mongoose = require('mongoose');
const MONGO_URI = 'mongodb+srv://chinmay1819:c9403000981@cluster0.8j3na.mongodb.net/chatApp?retryWrites=true&w=majority'
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

const PORT = process.env.PORT || 3000;
const messageSchema = new mongoose.Schema({
    user: String,
    message: String
});
const Message = mongoose.model('Message', messageSchema);
http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})
app.use(express.static(__dirname + '/public'))
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})


//socket

const io = require('socket.io')(http);
io.on('connection', (socket) => {
    console.log('Connected...');

    socket.on('message', (msg) => {
        const message = new Message({
            user: msg.user,
            message: msg.message
        });
        message.save().catch((error) => {
            console.error('Error saving message:', error);
        });
        socket.broadcast.emit('message', msg)


    })



})

