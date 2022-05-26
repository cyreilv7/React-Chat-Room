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
  
const users = {}; // format: { client.id: {username: username, id: client.id}, ... }
const chatBot = {username: "ChatBot"}
const messages = {
    general: [],
    random: [],
    pets: [],
    "career-advice": []
}

// event listeners
io.on("connection", (socket) => {
    // when user enters, update userlist for all sockets
    socket.on("userEntered", (username) => {
        const user = {
            username: username,
            id: socket.id
        };
        users[socket.id] = user;
        io.emit("connected", { 
            user: user, 
            msg: {
                text: `${user.username} has joined the chat.`,
                date: new Date().toISOString(),
                user: chatBot,
            } 
        });
        io.emit("users", Object.values(users));
    });

    socket.on("join room", (roomName, cb) => {
        socket.join(roomName);
        cb(messages[roomName]);
    });


    socket.on("send", ({ content, to, sender, chatName, isChannel }) => {
        if (isChannel) {
            const payload = {
                content,
                chatName,
                sender,
            };
            socket.to(to).emit("message", payload); // 'to' can be a room name or socket id
        } else {
            const payload = {
                content,
                chatName: sender, // dm chat name = sender 
                sender,
            };
            socket.to(to).emit("message", payload);
        }
        if (messages[chatName]) {
            messages[chatName].push({
                sender,
                content
            });
        }
    });

    socket.on("disconnect", () => {
        io.emit("disconnected", {
            msg: {
                text: `${users[socket.id].username} has left the chat.`,
                date: new Date().toISOString(),
                user: chatBot,
            }, 
            id: socket.id,
        });
        delete users[socket.id]
    });
})

