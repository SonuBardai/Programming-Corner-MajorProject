const express = require("express");
const router = express.Router();
const utils = require("./utils");
const User = require("../models/user");

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
		const username = user.name;
		res.status(200).render("chat", { req, username });
	} catch (error) {
		console.log(error);
	}
});

router.post("/", utils.isAuthenticated, (req, res) => {});

server.listen(3000, () => {
	console.log("listening on *:3000");
});

module.exports = router;
