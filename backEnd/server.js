const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const port = 3000;

app.get("/articles/", (req, response) => {
  response.setHeader("Content-Type", "application/json");
  // some logic to pull articles from database
  return response.status(200).send({
    message: "OK",
  });
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
