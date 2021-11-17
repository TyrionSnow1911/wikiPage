// Test Coverage
// 1. test collection creation
// 2. test send query

import { QueryEnum } from "../enum/queryEnum";
import { DocumentDto } from "../models/dto/documentDto";
import { MongoDbUtilities } from "../utilities/mongoDbUtilities";

describe("test send query method.", function () {
  it("should return the correct data.", function () {
    var collectionName = Math.random().toString(36).slice(2);
    MongoDbUtilities.createCollection(collectionName);

    // verify collection exists.
    MongoClient.connect(url, function (error, mongoClient) {
      var databaseConnection = mongoClient.db(`${database}`);
      databaseConnection.db.collectionNames(
        collectionName,
        function (err, names) {
          if (error) throw error;
          expect(names.length > 0).toBe(true);
        }
      );
    });
  });
});

describe("test send query method.", function () {
  it("should return the correct data.", function () {
    // 1. Create new document in mongodb.
    var documentDto = new DocumentDto().getRandomDocument();
    var queryResultDto = MongoDbUtilities.sendQuery(
      QueryEnum.INSERT,
      documentDto
    );
    expect([200, 201]).toContain(queryResultDto.getStatusCode());
    expect(queryResultDto.getMessage()).toBe(MessageEnum.OK);

    // 2. Verify the document was created succesfully.
    var queryResultDto = MongoDbUtilities.sendQuery(
      QueryEnum.FIND,
      documentDto
    );
    var testDocument = queryResultDto.getDocuments().shift();
    expect(testDocument["name"]).toBe(documentDto.getName());
    expect(testDocument["body"]).toBe(documentDto.getBody());

    // 3. Modify the document body created in step 1.
    var newDocumentBody = Math.random().toString(36).slice(2);
    documentDto.setBody(newDocumentBody);
    var queryResultDto = MongoDbUtilities.sendQuery(
      QueryEnum.INSERT,
      documentDto
    );
    expect([200, 201]).toContain(queryResultDto.getStatusCode());
    expect(queryResultDto.getMessage()).toBe(MessageEnum.OK);

    // 4. Retrieve and verify the new body of the document created in step 1.
    var queryResultDto = MongoDbUtilities.sendQuery(
      QueryEnum.FIND,
      documentDto
    );
    var testDocument = queryResultDto.getDocuments().shift();
    expect(testDocument["body"]).toBe(documentDto.getBody());
  });
});
