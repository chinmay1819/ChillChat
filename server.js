const express=require('express');
const app=express();
const https=require('https');
const path =require('path');
const fs=require('fs');

// const PORT=process.env.PORT || 3000;

// https.listen(PORT,()=>{
//     console.log(Listening on port ${PORT})
// })

const sslServer=https.createServer({
    key:fs.readFileSync(path.join(__dirname, "certs",'key.pem')),
    cert:fs.readFileSync(path.join(__dirname, "certs",'cert.pem'))
},app)
sslServer.listen(3000,()=>console.log('Secure Server on 3000'))

app.use(express.static(__dirname + "/public"))
app.get('/',(req,res)=>{
    console.log("request received on 3000");
    res.sendFile(__dirname + '/index.html');
})


//socket

const io=require('socket.io')(https);
io.on('connection',(socket)=>{
    console.log('Connected...');
    socket.on('message',(msg)=>{
        socket.broadcast.emit('message',msg)
    })

})