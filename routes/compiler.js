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
        script: code,
        stdin: input,
        language: language,
        versionIndex: "0",
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
    };

    const url = "https://api.jdoodle.com/v1/execute";

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
            console.log("Response from API: ", response.data);
            res.status(200).render("compile", {
                req,
                output: response.data.output,
                program: code,
                input,
                execTime: response.data.cpuTime,
                execMemory: response.data.memory,
            });
        })
        .catch((error) => {
            console.log(error);
        });
});

router.get("/", (req, res) => {
    res.status(200).render("compile", {
        req,
        output: "",
        program: "",
        input: "",
        execTime: 0,
        execMemory: 0,
    });
});

module.exports = router;
