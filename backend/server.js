const PORT = 9090;
const DB_PORT = 27017;
const DATABASE = "database";
const ARTICLES = "articles";
const express = require("express");
const app = express();

const { MongoClient } = require("mongodb");
var url = `mongodb://localhost:${DB_PORT}/${DATABASE}`;

MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  console.log("Database created!");

  var databaseConnection = db.db(`${DATABASE}`);
  try {
    databaseConnection.createCollection(`${ARTICLES}`, function (err, res) {
      console.log(`${ARTICLES} collection created!`);
      db.close();
    });
  } catch (error) {
    console.error(error);
  }
});

app.get("/articles/", (req, response) => {
  response.setHeader("Content-Type", "application/json");
  // logic to pull articles from database
  return response.status(200).send({
    message: "OK",
  });
});

app.put("/articles/:name", (req, response) => {
  // logic to update article in mongodb
  response.send("");
});

app.get("/articles/:name", (req, response) => {
  // logic to get article data from mongodb
  response.send("");
});

app.listen(PORT, () =>
  console.log(`Hello world app listening on port ${PORT}!`)
);
