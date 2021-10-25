const express = require("express");
const app = express();
const port = 3000;

app.get("/articles/", (req, res) => {
  res.send("");
});

app.put("/articles/:name", (req, res) => {
  res.send("");
});

app.get("/articles/:name", (req, res) => {
  res.send("");
});

app.listen(port, () =>
  console.log(`Hello world app listening on port ${port}!`)
);
