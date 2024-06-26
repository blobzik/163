const express = require('express');
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:8080"
    }
});

app.get('/', async (req, res) => {
    return res.send(123);
});

app.listen(3000, async () => {
    console.log('Server started');
});

io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (token === 'secret') {
        next();
    } else {
        const err = new Error("not authorized");
        err.data = { content: "Please retry later" };
        next(err);
    }
});

io.on("connection", (socket) => {
    socket.on('message', (data) => {
        socket.emit('message', data);
    })
});


httpServer.listen(3001);
