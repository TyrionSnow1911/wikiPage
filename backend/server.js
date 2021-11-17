import { QueryResultDto } from "./models/dto/queryResultDto";
import { DocumentDto } from "./models/dto/documentDto";
import { Message } from "./enum/messageEnum";
import express from "express";

const PORT = 9090;
const MONGODB_PORT = 27017;
const DATABASE = "database";
const ARTICLES = "articles";
const TEXT_HTML = "text/html";
const CONTENT_TYPE = "Content-Type";
const JSON_APPLICATION = "application/json";

var app = express();
var { MongoClient } = require("mongodb");
var url = `mongodb://localhost:${MONGODB_PORT}/${DATABASE}`;

MongoClient.connect(url, function (error, mongoClient) {
  try {
    if (error) throw error;

    console.log("Database created.");

    var databaseConnection = mongoClient.db(`${DATABASE}`);

    databaseConnection.createCollection(
      `${ARTICLES}`,
      function (error, response) {
        if (error) throw error;

        console.log(`${ARTICLES} collection created!`);
        console.log(response);
        mongoClient.close();
      }
    );
  } catch (error) {
    console.error(error);
  }
});

/**
 
 * @returns {QueryResultDto} Returns Dto containing the results of a query.
 */
export function query(queryType = "", documentDto = DocumentDto.get()) {
  var queryResultDto = QueryResultDto.get();

  if (queryType == "PUT") {
    MongoClient.connect(url, function (error, mongoClient) {
      var databaseConnection = mongoClient.db(`${DATABASE}`);
      if (error) throw error;

      // check if document already exists.
      databaseConnection
        .collection(`${ARTICLES}`)
        .find({ name: documentDto.getName() }, {})
        .toArray(function (error, response) {
          if (error) throw error;
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
            if (error) throw error;
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
      if (error) throw error;

      var documentQuery = null;
      if (documentDto.getName() == "") {
        // empty document query to get all documents from mongodb
        documentQuery = {};
      } else {
        documentQuery = { name: documentDto.getName() };
      }

      databaseConnection
        .collection(`${ARTICLES}`)
        .find(documentQuery, {})
        .toArray(function (error, document) {
          if (error) throw error;
          console.log(document);
          queryResultDto.setHeader({ CONTENT_TYPE: TEXT_HTML });
          queryResultDto.setStatus(200);
          queryResultDto.setMessage(Message.OK);
          queryResultDto.setDocument(document.shift());
          mongoClient.close();
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
      .send({
        message: queryResultDto.getMessage(),
        data: JSON.stringify(queryResultDto.getDocument()),
      })
      .end();
    console.log(result);
  } catch (error) {
    console.error(error);
    var result = response
      .setHeader(CONTENT_TYPE, JSON_APPLICATION)
      .status(404)
      .send({ message: Message.NOT_FOUND })
      .end();
  }
});

app.put("/articles/:name", (request, response) => {
  try {
    var documentDto = DocumentDto.get();
    documentDto.setName(request.body.name);

    var queryResultDto = query("PUT", documentDto);
    response
      .setHeader(queryResultDto.getHeader())
      .status(queryResultDto.getStatusCode())
      .send({ message: queryResultDto.getMessage() })
      .end();
  } catch (error) {
    console.error(error);
    response
      .setHeader(CONTENT_TYPE, JSON_APPLICATION)
      .status(500)
      .send({ message: Message.INTERNAL_SERVER_ERROR })
      .end();
  }
});

app.get("/articles/:name", (request, response) => {
  try {
    var documentDto = DocumentDto.get();
    documentDto.setName(request.body.name);
    var queryResultDto = query("GET", documentDto);
    response
      .setHeader(queryResultDto.getHeader())
      .status(queryResultDto.getStatusCode())
      .send({
        message: queryResultDto.getMessage(),
        data: JSON.stringify(queryResultDto.getDocument()),
      })
      .end();
  } catch (error) {
    console.error(error);
    response
      .setHeader(CONTENT_TYPE, JSON_APPLICATION)
      .status(404)
      .send({ message: Message.NOT_FOUND })
      .end();
  }
});

app.listen(PORT, () => console.log(`Wikipedia app listening on port ${PORT}!`));
