import { DocumentDto } from "../models/dto/documentDto";
import { QueryResultDto } from "../models/dto/queryResultDto";

var { MongoClient } = require("mongodb");
var database = "database";
var url = `mongodb://localhost:${MONGODB_PORT}/${database}`;

export class MongoDbUtilities {
  constructor() {
    // pass
  }

  static createCollection(collectionName = "") {
    MongoClient.connect(url, function (error, mongoClient) {
      try {
        if (error) throw error;

        var databaseConnection = mongoClient.db(`${database}`);

        databaseConnection.createCollection(
          `${collectionName}`,
          function (error, response) {
            if (error) throw error;

            console.log(`${collectionName} collection created!`);
            console.log(response);
            mongoClient.close();
          }
        );
      } catch (error) {
        console.error(error);
      }
    });
  }

  /**@returns {QueryResultDto} */
  static sendQuery(
    collectionName = "",
    queryType = "",
    documentDto = new DocumentDto().get()
  ) {
    var queryResultDto = new QueryResultDto().get();

    if (queryType == QueryEnum.INSERT) {
      MongoClient.connect(url, function (error, mongoClient) {
        var databaseConnection = mongoClient.db(`${database}`);
        if (error) throw error;

        // check if document already exists.
        databaseConnection
          .collection(`${collectionName}`)
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
          .collection(`${collectionName}`)
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
    } else if (queryType == QueryEnum.FIND) {
      MongoClient.connect(url, function (error, mongoClient) {
        var databaseConnection = mongoClient.db(`${database}`);
        if (error) throw error;

        var documentQuery = null;
        if (documentDto.getName() == "") {
          // empty query to get all documents from mongodb
          documentQuery = {};
        } else {
          documentQuery = { name: documentDto.getName() };
        }

        databaseConnection
          .collection(`${collectionName}`)
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
}
