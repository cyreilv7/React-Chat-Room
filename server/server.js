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
    })


    socket.on("send", message => {
        io.emit("message", {
            text: message,
            date: new Date().toISOString(),
            user: users[socket.id],
        });
    })

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
    })
})

