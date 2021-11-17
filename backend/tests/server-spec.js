// Tests Coverage.
// 1. test query function
// 2. test get all documents
// 3. test create new document
// 4. test modify existing document
// 5. test get document

import axios from "axios";
import { MessageEnum } from "../enum/messageEnum";
import { QueryEnum } from "../enum/queryEnum";
import { DocumentDto } from "../models/dto/documentDto";
import { query } from "../server.js";

const PORT = 9090;
const SERVER_URL = `http://localhost:${PORT}/`;

describe("test query function.", function () {
  it("should return the correct data.", function () {
    // 1. Create new document in mongodb.
    var documentDto = new DocumentDto().getRandomDocument();
    var queryResultDto = query(QueryEnum.PUT, documentDto);
    expect([200, 201]).toContain(queryResultDto.getStatusCode());
    expect(queryResultDto.getMessage()).toBe(MessageEnum.OK);

    // 2. Verify the document was created succesfully.
    var queryResultDto = query(QueryEnum.GET, documentDto);
    var testDocument = queryResultDto.getDocuments().shift();
    expect(testDocument["name"]).toBe(documentDto.getName());
    expect(testDocument["body"]).toBe(documentDto.getBody());

    // 3. Modify the document body created in step 1.
    var newDocumentBody = Math.random().toString(36).slice(2);
    documentDto.setBody(newDocumentBody);
    var queryResultDto = query(QueryEnum.PUT, documentDto);
    expect([200, 201]).toContain(queryResultDto.getStatusCode());
    expect(queryResultDto.getMessage()).toBe(MessageEnum.OK);

    // 4. Retrieve and verify the new body of the document created in step 1.
    var queryResultDto = query(QueryEnum.GET, documentDto);
    var testDocument = queryResultDto.getDocuments().shift();
    expect(testDocument["body"]).toBe(documentDto.getBody());
  });
});

describe("test endpoint: get all documents.", function () {
  it("should return the correct data.", function () {
    var endpointURL = `${SERVER_URL}/articles/`;
    var documentDto1 = new DocumentDto().getRandomDocument();
    var documentDto2 = new DocumentDto().getRandomDocument();
    var documentDto3 = new DocumentDto().getRandomDocument();

    // 1. Create set of new documents in mongodb.
    var queryResultDto1 = query(QueryEnum.PUT, documentDto1);
    expect([200, 201]).toContain(queryResultDto1.getStatusCode());
    expect(queryResultDto1.getMessage()).toBe(MessageEnum.OK);

    var queryResultDto2 = query(QueryEnum.PUT, documentDto2);
    expect([200, 201]).toContain(queryResultDto2.getStatusCode());
    expect(queryResultDto2.getMessage()).toBe(MessageEnum.OK);

    var queryResultDto3 = query(QueryEnum.PUT, documentDto3);
    expect([200, 201]).toContain(queryResultDto3.getStatusCode());
    expect(queryResultDto3.getMessage()).toBe(MessageEnum.OK);

    // 2. Use endpoint to retrieve all documents in mongodb.
    axios
      .get(endpointURL)
      .then((response) => {
        // 3. Verify that all documents created in step 1 are present in the list of results.
        var documents = response.data;
        expect(documents).toContain(documentDto1.getName());
        expect(documents).toContain(documentDto2.getName());
        expect(documents).toContain(documentDto3.getName());
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

describe("test endpoint: get document by name.", function () {
  it("should return the correct data.", function () {
    var endpointURL = `${SERVER_URL}/articles/:name`;
    // 1. Create a new document in mongodb.
    var documentDto = new DocumentDto().getRandomDocument();
    var queryResultDto = query(QueryEnum.PUT, documentDto);
    expect([200, 201]).toContain(queryResultDto1.getStatusCode());
    expect(queryResultDto.getMessage()).toBe(MessageEnum.OK);

    // 2. Retrieve and verify the contents of document created in step 1.

    axios
      .get(endpointURL, documentDto.getName())
      .then((response) => {
        var message = response.message;
        var statusCode = response.status;
        var endpointDocumentDto = response.data;
        expect(message).toBe(MessageEnum.OK);
        expect(statusCode).toBe(200);
        expect(endpointDocumentDto.getName()).toBe(documentDto.getName());
        expect(endpointDocumentDto.getBody()).toBe(documentDto.getBody());
      })
      .catch((error) => {
        console.log(error);
      });
  });
});

describe("test endpoint: create and modify existing document.", function () {
  it("should return the correct data.", function () {
    var endpointURL = `${SERVER_URL}/articles/:name`;
    const config = { headers: { "Content-Type": "application/json" } };

    // 1. Create a new document in mongodb.
    var documentDto = new DocumentDto().getRandomDocument();

    axios
      .put(
        endpointURL,
        { name: documentDto.getName(), body: documentDto.getBody() },
        config
      )
      .then((response) => {
        var message = response.message;
        var statusCode = response.status;

        expect(message).toBe(MessageEnum.OK);
        expect(statusCode).toBe(201);
      })
      .catch((error) => {
        console.log(error);
      });

    // 2. Verify the document in step 1 is created.
    var queryResultDto = query(QueryEnum.GET, documentDto);
    var testDocument = queryResultDto.getDocuments().shift();
    expect(testDocument["name"]).toBe(documentDto.getName());
    expect(testDocument["body"]).toBe(documentDto.getBody());

    // 3. Modify the body of the document created in step 1.
    var newTestDocumentBody = "newTestDocumentBody";
    documentDto.setBody(newTestDocumentBody);

    axios
      .put(
        endpointURL,
        { name: documentDto.getName(), body: documentDto.getBody() },
        config
      )
      .then((response) => {
        var message = response.message;
        var statusCode = response.status;

        expect(message).toBe(MessageEnum.OK);
        expect(statusCode).toBe(200);
      })
      .catch((error) => {
        console.log(error);
      });

    // 4. Verify the modification in step 3.
    var queryResultDto = query(QueryEnum.GET, documentDto);
    var testDocument = queryResultDto.getDocuments().shift();
    expect(testDocument["name"]).toBe(documentDto.getName());
    expect(testDocument["body"]).toBe(documentDto.getBody());
  });
});
