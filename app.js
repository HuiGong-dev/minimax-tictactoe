const express  = require("express");
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
let player1PickedCircle = true;

app.use(express.static("public"));

app.get("/", (req, res)=> {
    res.sendFile(__dirname + "/index.html")

});

io.on('connection', (socket) => {
    socket.on('player1PickedCircle', (data)=>{
        player1PickedCircle = data;
        console.log(player1PickedCircle);
    });
    socket.on('join', () => {
        io.emit('player1PickedCircle', player1PickedCircle);
    });
    socket.on('msg', (msg) => {
      io.emit('msg', msg);
    });
    socket.on('quit', ()=>{
        io.emit('quit');
    });
    socket.on('next-round', ()=>{
        io.emit('next-round');
    })
  });

server.listen(3050, ()=> {
    console.log("server is running on *:3050");
})