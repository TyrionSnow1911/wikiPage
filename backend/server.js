import { QueryDto } from "./models/dto/queryDto";
import { DocumentDto } from "./models/dto/documentDto";
import { Message } from "./enum/messageEnum";

const EXPRESS = require("express");
const PORT = 9090;
const MONGODB_PORT = 27017;
const DATABASE = "database";
const ARTICLES = "articles";
const APP = express();
const CONTENT_TYPE = "Content-Type";
const JSON_APPLICATION = "application/json";
const TEXT_HTML = "text/html";

const { MongoClient } = require("mongodb");
var url = `mongodb://localhost:${MONGODB_PORT}/${DATABASE}`;

MongoClient.connect(url, function (error, db) {
  if (error) {
    throw error; // Client displays, 'server down'?
  }
  console.log("Database created!");

  var databaseConnection = db.db(`${DATABASE}`);
  try {
    databaseConnection.createCollection(
      `${ARTICLES}`,
      function (error, result) {
        if (error) {
          throw error;
        }
        console.log(`${ARTICLES} collection created!`);
        console.log(result);
        db.close();
      }
    );
  } catch (error) {
    console.error(error);
  }
});

export function query(queryType = "", documentDto = DocumentDto.get()) {
  documentName = documentDto.getName();
  documentBody = documentDto.getBody();
  queryDto = QueryDto.get();

  if (queryType == "PUT") {
    MongoClient.connect(url, function (error, db) {
      var databaseConnection = db.db(`${DATABASE}`);
      if (error) {
        throw error;
      }

      databaseConnection
        .collection(`${ARTICLES}`)
        .find(documentName, {})
        .toArray(function (error, result) {
          if (error) {
            throw error;
          }
          console.log(result);
          databaseConnection.close();

          if (result.length > 0) {
            queryDto.setStatus(200);
          } else {
            queryDto.setStatus(201);
          }
        });

      databaseConnection
        .collection(`${ARTICLES}`)
        .insertOne(documentDto, function (error, result) {
          if (error) {
            throw error;
          }
          console.log(`${documentName} inserted successfully.`);
          queryDto.setMessage(`${documentName} inserted successfully.`);
        });
      databaseConnection.close();
      return queryDto;
    });
  } else if (queryType == "GET") {
    MongoClient.connect(url, function (error, db) {
      var databaseConnection = db.db(`${DATABASE}`);
      if (error) {
        throw error;
      }

      databaseConnection
        .collection(`${ARTICLES}`)
        .find(documentName, {})
        .toArray(function (error, document) {
          if (error) {
            throw error;
          }
          console.log(document);
          db.close();
          queryDto.setHeader({ CONTENT_TYPE: TEXT_HTML });
          queryDto.setStatus(200);
          queryDto.setMessage(Message.OK);
          queryDto.setDocument(document);
        });
    });
  } else {
    throw "Unrecognized Query Type.";
  }
}

APP.get("/articles/", (request, response) => {
  try {
    documentDto = DocumentDto.get();
    var queryDto = query("GET", documentDto);
    result = response
      .setHeader(queryDto.getHeader())
      .status(queryDto.getStatusCode())
      .end(JSON.stringify(queryDto.getDocument()))
      .send({ message: queryDto.getMessage() });
    console.log(result);
    return result;
  } catch (error) {
    result = response
      .setHeader(CONTENT_TYPE, JSON_APPLICATION)
      .status(404)
      .send({ message: Message.NOT_FOUND });
    return result;
  }
});

APP.put("/articles/:name", (request, response) => {
  request.on("end", function () {
    try {
      var put = qs.parse(body);

      documentDto = DocumentDto.get();
      documentDto.setName(put["name"]);
      documentDto.setBody(put["body"]);

      queryDto = query("PUT", documentDto);
      result = response
        .setHeader(queryDto.getHeader())
        .status(queryDto.getStatusCode())
        .send({ message: queryDto.getMessage() });
      return result;
    } catch (error) {
      result = response
        .setHeader(CONTENT_TYPE, JSON_APPLICATION)
        .status(500)
        .send({ message: Message.INTERNAL_SERVER_ERROR });
      return result;
    }
  });
});

APP.get("/articles/:name", (request, response) => {
  request.on("end", function () {
    try {
      var get = qs.parse(body);
      documentDto = DocumentDto.get();
      documentDto.setName(get["name"]);
      documentDto.setBody(get["body"]);

      var queryDto = query("GET", documentDto);
      result = response
        .setHeader(queryDto.getHeader())
        .status(queryDto.getStatusCode())
        .end(JSON.stringify(queryDto.getDocument()))
        .send({ message: queryDto.getMessage() });
      return result;
    } catch (error) {
      result = response
        .setHeader(CONTENT_TYPE, JSON_APPLICATION)
        .status(404)
        .send({ message: Message.NOT_FOUND });
      return result;
    }
  });
});

APP.listen(PORT, () =>
  console.log(`Hello world app listening on port ${PORT}!`)
);
