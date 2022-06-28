const express = require("express");
const router = express.Router();
const utils = require("./utils");
const User = require("../models/user");
const Message = require("../models/message");

const server = require("http").createServer(router);

const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    socket.on("send", (data) => {
        socket.broadcast.emit("receive", data);
    });
});

router.get("/", utils.isAuthenticated, async (req, res) => {
    const id = req.user._conditions._id;
    try {
        const user = await User.findById(id);
        const messages = await Message.find({});
        const username = user.name;
        res.status(200).render("chat", { req, username, messages });
    } catch (error) {
        console.log(error);
    }
});

router.post("/saveChat", utils.isAuthenticated, async (req, res) => {
    try {
        const message = new Message(req.body);
        await message.save();
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
    }
});

const SOCKET_IO_PORT = process.env.SOCKET_IO_PORT;

server.listen(SOCKET_IO_PORT, () => {
    console.log(`Socket.io running on PORT ${SOCKET_IO_PORT}`);
});

module.exports = router;
