// const http = require("http");
const express = require("express");
const app = express();
const hostname = "127.0.0.1";
const port = 3000;
app.use(express.static(__dirname + "/assets/"));
app.use(express.static(__dirname + "/js"));

app.get("/", (req, res) => {
  // res.send("Hello World!");
  res.sendFile("view.html", { root: __dirname });
});

app.listen(port, function () {
  console.log("Started application on port %d", port);
});

/* const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello World");
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
}); */
