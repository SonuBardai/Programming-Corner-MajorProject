const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../models/user");
const utils = require("./utils");

const localStrategy = require("./strategies/local");
localStrategy();

router.get("/register", utils.isNotAuthenticated, (req, res) => {
	res.status(200).render("register", { req });
});

router.post("/register", utils.isNotAuthenticated, async (req, res) => {
	let tempUser = await User.findOne({ name: req.body.name });
	if (tempUser) {
		req.flash(
			"error",
			"A user with that name already exists. Please pick another name."
		);
		res.redirect("/users/register");
		return;
	}
	tempUser = await User.findOne({ email: req.body.email });
	if (tempUser) {
		req.flash("error", "A user with that email already exists.");
		res.redirect("/users/register");
		return;
	}
	if (req.body.password1 === req.body.password2) {
		const hashedPassword = await bcrypt.hash(req.body.password1, 10);
		let userData = new User({
			name: req.body.name,
			email: req.body.email,
			password: hashedPassword,
		});
		userData
			.save()
			.then(() => {
				res.redirect("/users/login");
			})
			.catch((err) => {
				req.flash("error", err);
				console.log("EROR AYA BHAYA ", err);
				res.redirect("/users/register");
				return;
			});
	} else {
		req.flash("error", "Passwords should match");
		res.redirect("/users/register");
		return;
	}
});

router.get("/login", utils.isNotAuthenticated, (req, res) => {
	res.status(200).render("login", { req });
});

router.post(
	"/login",
	utils.isNotAuthenticated,
	passport.authenticate("local", {
		failureRedirect: "/users/login",
		failureMessage: true,
		failureFlash: true,
		successRedirect: "/",
		successFlash: true,
	}),
	(req, res) => {
		console.log("BDY: ", req.body);
		res.send(req.body);
	}
);

router.get("/logout", utils.isAuthenticated, (req, res) => {
	req.logout();
	req.flash("success", "You have been logged out successfully.");
	res.redirect("/");
});

module.exports = router;
