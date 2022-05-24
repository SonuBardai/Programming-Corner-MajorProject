const express = require("express");
const router = express.Router();
const utils = require("./utils");

const server = require("http").createServer(router);

const io = require("socket.io")(server, {
	cors: {
		origin: "http://localhost",
		methods: ["GET", "POST"],
	},
});

io.on("connection", (socket) => {
	socket.on("new-user-joined", (name) => {
		console.log(name);
	});
});

router.get("/", utils.isAuthenticated, (req, res) => {
	router.get("io").emit("new-user-joined", "MERA BAVA");
	res.status(200).render("chat", { req });
});

router.post("/", utils.isAuthenticated, (req, res) => {});

server.listen(3000, () => {
	console.log("listening on *:3000");
});

module.exports = router;
