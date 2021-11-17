import { DocumentDto } from "./models/dto/documentDto";
import { MessageEnum } from "./enum/messageEnum";
import { QueryEnum } from "./enum/queryEnum";
import express from "express";
import { MongoDbUtilities } from "./utilities/mongoDbUtilities";

const PORT = 9090;
const MONGODB_PORT = 27017;
const DATABASE = "database";

const TEXT_HTML = "text/html";
const CONTENT_TYPE = "Content-Type";
const JSON_APPLICATION = "application/json";

var app = express();
var collectionName = "articles";
var { MongoClient } = require("mongodb");
var url = `mongodb://localhost:${MONGODB_PORT}/${DATABASE}`;

MongoDbUtilities.createCollection(collectionName);

app.get("/articles/", (request, response) => {
  try {
    var queryResultDto = MongoDbUtilities.sendQuery(QueryEnum.FIND);
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

    var queryResultDto = MongoDbUtilities.sendQuery(
      QueryEnum.INSERT,
      documentDto
    );
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
    var queryResultDto = MongoDbUtilities.sendQuery(
      QueryEnum.FIND,
      documentDto
    );
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
