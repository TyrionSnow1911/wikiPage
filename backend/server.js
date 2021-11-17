import { QueryResultDto } from "./models/dto/queryResultDto";
import { DocumentDto } from "./models/dto/documentDto";
import { MessageEnum } from "./enum/messageEnum";
import { QueryEnum } from "./enum/queryEnum";
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
export function query(queryType = "", documentDto = new DocumentDto().get()) {
  var queryResultDto = new QueryResultDto().get();

  if (queryType == QueryEnum.PUT) {
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
            queryResultDto.setMessage(MessageEnum.OK);
          }
        );
      mongoClient.close();
      return queryResultDto;
    });
  } else if (queryType == QueryEnum.GET) {
    MongoClient.connect(url, function (error, mongoClient) {
      var databaseConnection = mongoClient.db(`${DATABASE}`);
      if (error) throw error;

      var documentQuery = null;
      if (documentDto.getName() == "") {
        // empty query to get all documents from mongodb
        documentQuery = {};
      } else {
        documentQuery = { name: documentDto.getName() };
      }

      databaseConnection
        .collection(`${ARTICLES}`)
        .find(documentQuery, {})
        .toArray(function (error, documents) {
          if (error) throw error;
          console.log(documents);
          queryResultDto.setHeader({ CONTENT_TYPE: TEXT_HTML });
          queryResultDto.setStatus(200);
          queryResultDto.setMessage(MessageEnum.OK);
          queryResultDto.setDocuments(documents);
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
    var queryResultDto = query(QueryEnum.GET);
    var result = response
      .setHeader(queryResultDto.getHeader())
      .status(queryResultDto.getStatusCode())
      .send({
        message: queryResultDto.getMessage(),
        data: JSON.stringify(queryResultDto.getDocuments()),
      })
      .end();
    console.log(result);
  } catch (error) {
    console.error(error);
    var result = response
      .setHeader(CONTENT_TYPE, JSON_APPLICATION)
      .status(404)
      .send({ message: MessageEnum.NOT_FOUND })
      .end();
  }
});

app.put("/articles/:name", (request, response) => {
  try {
    var documentDto = new DocumentDto().get();
    documentDto.setName(request.body.name);
    documentDto.setBody(request.body.body);

    var queryResultDto = query(QueryEnum.PUT, documentDto);
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
      .send({ message: MessageEnum.INTERNAL_SERVER_ERROR })
      .end();
  }
});

app.get("/articles/:name", (request, response) => {
  try {
    var documentDto = new DocumentDto().get();
    documentDto.setName(request.body.name);
    var queryResultDto = query(QueryEnum.GET, documentDto);
    response
      .setHeader(queryResultDto.getHeader())
      .status(queryResultDto.getStatusCode())
      .send({
        message: queryResultDto.getMessage(),
        data: JSON.stringify(queryResultDto.getDocuments().shift()),
      })
      .end();
  } catch (error) {
    console.error(error);
    response
      .setHeader(CONTENT_TYPE, JSON_APPLICATION)
      .status(404)
      .send({ message: MessageEnum.NOT_FOUND })
      .end();
  }
});

app.listen(PORT, () => console.log(`Wikipedia app listening on port ${PORT}!`));
