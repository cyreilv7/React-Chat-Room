// set up http server with express
const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require("cors")
app.use(cors()); // take care of annoying network issues with cors

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

server.listen(3000, () => {
    console.log("testing server");
})