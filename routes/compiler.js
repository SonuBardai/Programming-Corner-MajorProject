const express = require("express");
const router = express.Router();

const cors = require("cors");
const axios = require("axios");

router.use(cors());

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post("/", (req, res) => {
	let code = req.body.codeBeta;
	let language = req.body.language;
	let input = req.body.input;

	let data = {
		code,
		language,
		input,
	};

	const url = "https://codexweb.netlify.app/.netlify/functions/enforceCode";

	let config = {
		method: "post",
		url,
		headers: {
			"Content-Type": "application/json",
		},
		data,
	};

	axios(config)
		.then((response) => {
			res.send(response.data);
			res.status(200).render("compile", { output: response.data });
		})
		.catch((error) => {
			console.log(error);
		});
});

router.get("/", (req, res) => {
	res.status(200).render("compile", { req, output: "" });
});

module.exports = router;
