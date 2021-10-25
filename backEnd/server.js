const express = require("express");
const app = express();
const port = 3000;

app.get("/articles/", (req, response) => {
  response.send("");
});

app.put("/articles/:name", (req, response) => {
  response.send("");
});

app.get("/articles/:name", (req, response) => {
  response.send("");
});

app.listen(port, () =>
  console.log(`Hello world app listening on port ${port}!`)
);
