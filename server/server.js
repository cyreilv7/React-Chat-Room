// set up http server with express
const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);

const PORT = 3001 || process.env.PORT;
server.listen(PORT);

// take care of annoying network issues with cors
const cors = require("cors");
app.use(cors()); 
const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
  
let users = []; // format: { client.id: {username: username, id: client.id}, ... }
const messages = {
    general: [],
    random: [],
    "programming-help": [],
    "career-advice": []
}

// event listeners
io.on("connection", (socket) => {
    // when user enters, update userlist for all sockets
    socket.on("join server", (username) => {
        const user = {
            username: username,
            id: socket.id
        };
        users.push(user);
        io.emit("new user", users);
    });

    socket.on("join room", (roomName, cb) => {
        socket.join(roomName);
        cb(messages[roomName]); // cb fn which passes server-side data to client-side
    });


    socket.on("send message", ({ content, to, sender, chatName, isChannel }) => {
        let date = new Date().toISOString();
        if (isChannel) {
            const payload = {
                content,
                chatName,
                sender,
                date: date,
            };
            socket.to(to).emit("new message", payload); // 'to' can be a room name or socket id
        } else {
            const payload = {
                content,
                chatName: sender, // dm chat name = sender 
                sender,
                date: date,
            };
            socket.to(to).emit("new message", payload);
        }
        if (messages[chatName]) {
            messages[chatName].push({
                sender,
                content,
                date: date,
            });
        }
    });

    socket.on("disconnect", () => {
        users = users.filter(user => user.id !== socket.id);
        io.emit("new user", users);
    });
})

