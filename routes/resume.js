const express = require("express");
const router = express.Router();
const path = require("path");

const pdf = require("html-pdf");

const pdfTemplate = require("../resume_script");

router.use(express.urlencoded({ extended: true }));

router.get("/home", (req, res) => {
	res.status(200).render("resume", { req });
});

router.post("/create-pdf", (req, res) => {
	pdf.create(pdfTemplate(req.body), {}).toFile("Resume.pdf", (err) => {
		if (err) {
			res.send(Promise.reject());
			console.log(err);
		}
		res.redirect("/resume/fetch-pdf");
	});
});

router.get("/fetch-pdf", (req, res) => {
	res.sendFile(path.join(__dirname, "../Resume.pdf"));
});

module.exports = router;
