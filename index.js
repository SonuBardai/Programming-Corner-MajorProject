const express = require("express");
const path = require("path");
const expressLayout = require("express-ejs-layouts");
const flash = require("express-flash");
const session = require("express-session");
const mongoose = require("mongoose");
const passport = require("passport");
const MongoStore = require("connect-mongo");

const PORT = 80;

app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "templates"));
app.set("layout", "base");

app.use("/static", express.static("static"));
app.use(expressLayout);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	session({
		secret: "secret_key",
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create({
			mongoUrl: "mongodb://localhost:27017/programmingCorner",
		}),
	})
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Routes
const blog_router = require("./routes/blog");
const resume_router = require("./routes/resume");
const compiler_router = require("./routes/compiler");
const auth_router = require("./routes/auth");
const chat_router = require("./routes/chat");

app.use("/blog", blog_router);
app.use("/resume", resume_router);
app.use("/compiler", compiler_router);
app.use("/users", auth_router);
app.use("/chat", chat_router);

app.get("/", (req, res) => {
	res.status(200).render("home", { req });
});

mongoose
	.connect("mongodb://localhost:27017/programmingCorner")
	.then(
		app.listen(PORT, () => {
			console.log(`Example app listening on port ${PORT}`);
		})
	)
	.catch((err) => console.log(err));
