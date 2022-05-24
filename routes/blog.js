const express = require("express");
const router = express.Router();
const Blog = require("../models/blog");
const utils = require("./utils");

router.get("/home", async (req, res) => {
	try {
		const blogs = await Blog.find({}).sort({ _id: -1 }).populate("user");
		res.status(200).render("blog-home", { req, blogs });
	} catch (error) {
		console.log(error);
	}
});

router.get("/post/:id", async (req, res) => {
	try {
		const blog = await Blog.findById(req.params.id).populate("user");
		res.status(200).render("blog-detail", { req, blog });
	} catch (error) {
		console.log(error);
	}
});

router.get("/submit", utils.isAuthenticated, (req, res) => {
	res.status(200).render("blog-submit", { req });
});

router.post("/submit", utils.isAuthenticated, async (req, res) => {
	const { title, content } = req.body;
	const user = req.user._conditions._id;

	const blog = new Blog({ title, content, user });
	try {
		await blog.save();
	} catch (error) {
		console.log(error);
	}
	req.flash("info", "Blog Post Uploaded");
	res.redirect("/blog/home");
});

module.exports = router;
