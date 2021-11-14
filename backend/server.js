import { QueryResultDto } from "./models/dto/queryResultDto";
import { DocumentDto } from "./models/dto/documentDto";
import { Message } from "./enum/messageEnum";
import express from "express";

const PORT = 9090;
const MONGODB_PORT = 27017;
const DATABASE = "database";
const ARTICLES = "articles";
const CONTENT_TYPE = "Content-Type";
const JSON_APPLICATION = "application/json";
const TEXT_HTML = "text/html";

var { MongoClient } = require("mongodb");
var app = express();
var url = `mongodb://localhost:${MONGODB_PORT}/${DATABASE}`;

MongoClient.connect(url, function (error, mongoClient) {
  try {
    if (error) {
      throw error;
    }
    console.log("Database created!");

    var databaseConnection = mongoClient.db(`${DATABASE}`);

    databaseConnection.createCollection(
      `${ARTICLES}`,
      function (error, response) {
        if (error) {
          throw error;
        }
        console.log(`${ARTICLES} collection created!`);
        console.log(response);
        mongoClient.close();
      }
    );
  } catch (error) {
    console.error(error);
  }
});

export function query(queryType = "", documentDto = DocumentDto.get()) {
  var queryResultDto = QueryResultDto.get();

  if (queryType == "PUT") {
    MongoClient.connect(url, function (error, mongoClient) {
      var databaseConnection = mongoClient.db(`${DATABASE}`);
      if (error) {
        throw error;
      }
      // check if document already exists.
      databaseConnection
        .collection(`${ARTICLES}`)
        .find({ name: documentDto.getName() }, {})
        .toArray(function (error, response) {
          if (error) {
            throw error;
          }
          console.log(response);
          mongoClient.close();

          if (response.length > 0) {
            queryResultDto.setStatus(200);
          } else {
            queryResultDto.setStatus(201);
          }
        });

      databaseConnection
        .collection(`${ARTICLES}`)
        .insertOne(
          { name: documentDto.getName(), body: documentDto.getBody() },
          function (error, response) {
            if (error) {
              throw error;
            }
            console.log(response);
            queryResultDto.setMessage(`${documentName} inserted successfully.`);
          }
        );
      mongoClient.close();
      return queryResultDto;
    });
  } else if (queryType == "GET") {
    MongoClient.connect(url, function (error, mongoClient) {
      var databaseConnection = mongoClient.db(`${DATABASE}`);
      if (error) {
        throw error;
      }
      if (documentDto.getName() == "") {
        var documentQuery = {};
      } else {
        var documentQuery = { name: documentDto.getName() };
      }

      databaseConnection
        .collection(`${ARTICLES}`)
        .find(documentQuery, {})
        .toArray(function (error, document) {
          if (error) {
            throw error;
          }
          console.log(document);
          mongoClient.close();
          queryResultDto.setHeader({ CONTENT_TYPE: TEXT_HTML });
          queryResultDto.setStatus(200);
          queryResultDto.setMessage(Message.OK);
          queryResultDto.setDocument(document);
          return queryResultDto;
        });
    });
  } else {
    throw "Unrecognized Query Type.";
  }
}

app.get("/articles/", (request, response) => {
  try {
    var queryResultDto = query("GET");
    var result = response
      .setHeader(queryResultDto.getHeader())
      .status(queryResultDto.getStatusCode())
      .end(JSON.stringify(queryResultDto.getDocument()))
      .send({ message: queryResultDto.getMessage() });
    console.log(result);
    return result;
  } catch (error) {
    var result = response
      .setHeader(CONTENT_TYPE, JSON_APPLICATION)
      .status(404)
      .send({ message: Message.NOT_FOUND });
    return result;
  }
});

app.put("/articles/:name", (request, response) => {
  try {
    var documentDto = DocumentDto.get();
    documentDto.setName(request.body.name);

    var queryResultDto = query("PUT", documentDto);
    var result = response
      .setHeader(queryResultDto.getHeader())
      .status(queryResultDto.getStatusCode())
      .send({ message: queryResultDto.getMessage() });
    return result;
  } catch (error) {
    var result = response
      .setHeader(CONTENT_TYPE, JSON_APPLICATION)
      .status(500)
      .send({ message: Message.INTERNAL_SERVER_ERROR });
    return result;
  }
});

app.get("/articles/:name", (request, response) => {
  try {
    var documentDto = DocumentDto.get();
    documentDto.setName(request.body.name);
    var queryResultDto = query("GET", documentDto);
    var result = response
      .setHeader(queryResultDto.getHeader())
      .status(queryResultDto.getStatusCode())
      .end(JSON.stringify(queryResultDto.getDocument().shift()))
      .send({ message: queryResultDto.getMessage() });
    return result;
  } catch (error) {
    var result = response
      .setHeader(CONTENT_TYPE, JSON_APPLICATION)
      .status(404)
      .send({ message: Message.NOT_FOUND });
    return result;
  }
});

app.listen(PORT, () => console.log(`Wikipedia app listening on port ${PORT}!`));
