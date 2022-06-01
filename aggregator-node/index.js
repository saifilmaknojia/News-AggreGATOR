const controller = require("./assets/js/node_controller");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;

app.use(express.static(__dirname + "/assets/"));
app.use(express.static(__dirname + "/js"));

// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

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

// POST /login gets urlencoded bodies
app.post("/news", urlencodedParser, function (req, res) {
  controller.formSearchString(req.body);
  res.send(
    "welcome, " +
      req.body.search +
      req.body.topic +
      req.body.last_n_days +
      req.body.sort_by
  );
});

app.listen(port, function () {
  console.log("Started application on port %d", port);
});
