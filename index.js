const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

app = express();

app.set("template engine", "html");
app.set("views", path.join(__dirname, "templates"));
app.use("/static", express.static("static"));

app.get("/", (req, res) => {
  res.status(200).render("home.pug");
});

app.get("/logout", (req, res) => {
  res.status(200).render("logout.pug");
});

app.get("/blog-home", (req, res) => {
  blogs = [
    {
      title: "Hello1",
      content: "World1",
      author: "user1",
    },
    {
      title: "Hello2",
      content: "World2",
      author: "user2",
    },
    {
      title: "Hello1",
      content: "World1",
      author: "user1",
    },
    {
      title: "Hello2",
      content: "World2",
      author: "user2",
    },
  ];
  res.status(200).render("blog-home.pug", {});
});

app.get("/blog/submit", (req, res) => {
  res.status(200).render("blog-submit.pug", {});
});

// COMPILER
const cors = require("cors");
const Axios = require("axios");
app.use(cors());
app.use(express.json());

app.use(bodyParser.json());
app.use(express.urlencoded());

app.post("/compile", (req, res) => {
  let code = req.body.codeBeta;
  let language = req.body.language;
  let input = req.body.input;

  let data = {
    code: code,
    language: language,
    input: input,
  };

  let config = {
    method: "post",
    url: "https://codexweb.netlify.app/.netlify/functions/enforceCode",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  Axios(config)
    .then((response) => {
      // res.send(response.data)
      res.status(200).render("compile.pug", { output: response.data });
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/compile", (req, res) => {
  res.status(200).render("compile.pug", { output: "" });
});

// RESUME BUILDER
const pdf = require("html-pdf");

app.use(bodyParser.urlencoded({ extended: true }));
const pdfTemplate = require("./resume_script");

app.get("/resume", (req, res) => {
  res.status(200).render("resume.pug");
});

app.post("/create-pdf", (req, res) => {
  pdf.create(pdfTemplate(req.body), {}).toFile("Resume.pdf", (err) => {
    if (err) {
      res.send(Promise.reject());
      console.log(err);
    }

    res.redirect("/fetch-pdf");
  });
});

app.get("/fetch-pdf", (req, res) => {
  res.sendFile(`${__dirname}/Resume.pdf`);
});

// LOGIN SYSTEM
const bcrypt = require("bcrypt");
// const passport = require('passport')
// const flash = require('express-flash')
// const session = require('express-session')
// const methodOverride = require('method-override')

const mongoose = require("mongoose");
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/programmingCorner");
}

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "can't be blank"],
    match: [/\S+@\S+\.\S+/, "is invalid"],
    index: true,
  },
  password: String,
});
User = mongoose.model("User", userSchema);

app.get("/register", (req, res) => {
  res.status(200).render("register.pug");
});

app.post("/register", async (req, res) => {
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
        res.redirect("login");
      })
      .catch(() => {
        res.redirect("register");
      });
  }
});

app.get("/login", (req, res) => {
  res.status(200).render("login.pug");
});

app.post("/login", (req, res) => {});

//SERVER LISTEN
port = 80;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
