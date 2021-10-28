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

function query(queryType = "", payload = {}) {
  document = payload["document"];
  data = payload["data"];

  if (queryType == "insert") {
    var newEntry = false;
    MongoClient.connect(url, function (err, db) {
      var databaseConnection = db.db(`${DATABASE}`);
      if (err) {
        return { success: false, result: err };
      }

      databaseConnection
        .collection(ARTICLES)
        .find(document, {})
        .toArray(function (err, result) {
          if (err) {
            return { success: false, result: err };
          }
          console.log(result);
          databaseConnection.close();
          newEntry = !(result.length > 0);
        });

      databaseConnection
        .collection(ARTICLES)
        .insertOne(payload, function (err, res) {
          if (err) {
            return { success: false, result: err };
          }
          console.log(`${document} inserted successfully.`);
        });
      databaseConnection.close();
      return { success: true, result: newEntry };
    });
  } else if (queryType == "find") {
    MongoClient.connect(url, function (err, db) {
      var databaseConnection = db.db(`${DATABASE}`);

      databaseConnection
        .collection(ARTICLES)
        .find(document, {})
        .toArray(function (err, res) {
          if (err) {
            return { success: false, result: err };
          }
          console.log(result);
          db.close();
          return { success: true, result: res };
        });
    });
  } else {
    throw "unrecognized query type.";
  }
}

app.get("/articles/", (req, response) => {
  try {
    payload = { document: null, data: null };
    var data = query("find", payload);
    result = response
      .setHeader("Content-Type", "application/json")
      .status(200)
      .end(JSON.stringify(data))
      .send({ message: "OK" });
    return result;
  } catch (error) {
    result = response
      .setHeader("Content-Type", "application/json")
      .status(500)
      .send({ message: String(error) });
    return result;
  }
});

app.put("/articles/:name", (req, response) => {
  req.on("end", function () {
    var put = qs.parse(body);
    var text = put["text"];
    var document = put["document"];
    payload = { document: document, data: text };

    data = query("insert", payload);

    var code = null;
    var msg = "";
    if (data["success"] == true) {
      if (data["newEntry"]) {
        code = 201;
        msg = "Created";
      } else {
        code = 200;
        msg = "OK";
      }
    }
  });
  result = response
    .setHeader("Content-Type", "application/json")
    .status(code)
    .send({ message: msg });
  return result;
});

app.get("/articles/:name", (req, response) => {
  request.on("end", function () {
    var get = qs.parse(body);
    var document = get["document"];
    payload = { document: document, data: null };
    var data = query("find", payload);
    result = response
      .setHeader("Content-Type", "application/json")
      .status(200)
      .end(JSON.stringify(data))
      .send({ message: "OK" });
    return result;
  });
});

app.listen(PORT, () =>
  console.log(`Hello world app listening on port ${PORT}!`)
);
