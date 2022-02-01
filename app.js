const express  = require("express");
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static("public"));

app.get("/", (req, res)=> {
    res.sendFile(__dirname + "/index.html")

});

io.on('connection', (socket) => {
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