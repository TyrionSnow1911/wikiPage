// Tests Coverage.
// 1. test query function
// 2. test get all articles
// 3. test create new document
// 4. test modify existing document
// 5. test get document

import { MessageEnum } from "../enum/messageEnum";
import { QueryEnum } from "../enum/queryEnum";
import { DocumentDto } from "../models/dto/documentDto";
import { query } from "../server.js";

const TEST_DOCUMENT_1_NAME = "test_document_1_name";
const TEST_DOCUMENT_1_BODY_1 = "test_document_1_body_1";
const TEST_DOCUMENT_1_BODY_2 = "test_document_1_body_1";

describe("Tests query function.", function () {
  it("Should return the correct data.", function () {
    // 1. Create new document in mongodb.
    var documentDto = new DocumentDto().get();
    documentDto.setName(`${TEST_DOCUMENT_1_NAME}`);
    documentDto.setBody(`${TEST_DOCUMENT_1_BODY_1}`);
    var queryResultDto = query(QueryEnum.PUT, documentDto);
    expect([200, 201]).toContain(queryResultDto.getStatusCode());
    expect(queryResultDto.getMessage()).toBe(MessageEnum.OK);

    // 2. Verify the document was created succesfully.
    var queryResultDto = query(QueryEnum.GET, documentDto);
    var testDocument = queryResultDto.getDocuments().shift();
    expect(testDocument["name"]).toBe(documentDto.getName());
    expect(testDocument["body"]).toBe(documentDto.getBody());

    // 3. Modify the document body created in step 1.
    documentDto.setBody(`${TEST_DOCUMENT_1_BODY_2}`);
    var queryResultDto = query(QueryEnum.PUT, documentDto);
    expect([200, 201]).toContain(queryResultDto.getStatusCode());
    expect(queryResultDto.getMessage()).toBe(MessageEnum.OK);

    // 4. Retrieve and verify the new body of the document created in step 1.
    var queryResultDto = query(QueryEnum.GET, documentDto);
    var testDocument = queryResultDto.getDocuments().shift();
    expect(testDocument["body"]).toBe(documentDto.getBody());
  });
});

describe("Tests endpoint for retrieving document by name.", function () {
  it("Should return the correct data.", function () {
    // 1. Create a new document in mongodb.
    // 2. Retrieve and verify the contents of document created in step 1.
  });
});

describe("Tests endpoint for retrieving all articles.", function () {
  it("Should return the correct data.", function () {
    // 1. Create set of new articles in mongodb.
    // 2. Retrieve all articles in mongodb.
    // 3. Verify that all articles created in step 1 are present in the list of results.
  });
});

describe("Tests endpoint for creating and modifying existing document.", function () {
  it("Should return the correct data.", function () {
    // 1. Create new document in mongodb.
    // 2. Verify the document in step 1 is created.
    // 3. Modify the body of the document created in step 1.
    // 4. Verify the modification in step 3.
  });
});
