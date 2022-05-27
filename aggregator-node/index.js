// const http = require("http");
const express = require("express");
const app = express();
const hostname = "127.0.0.1";
const port = 3000;

app.use(express.static(__dirname + "/assets/"));
app.use(express.static(__dirname + "/js"));

// set the view engine to ejs
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  // res.send("Hello World!");
  res.sendFile("view.html", { root: __dirname });
});

// News page
app.get("/news", function (req, res) {
  res.render("pages/index");
});

app.listen(port, function () {
  console.log("Started application on port %d", port);
});
