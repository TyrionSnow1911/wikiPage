// TODO: Re-write unit tests.

// const https = require("https");
// const ARTICLE_1 = "Article 1";

// function createArticles(articles = []) {
//   var n = articles.length;
// }
// function deleteArticles(articles = []) {}

// describe("Test get all articles.", function () {
//   it("The endpoint should return all articles names from server.", function () {
//     // TODO: add some articles on the back-end
//     // Delete them once testing is done

//     var result = null;
//     var code = null;
//     var message = null;

//     var expectedResult = [];
//     var expectedCode = 200;
//     var expectedMessage = "OK";

//     const options = {
//       hostname: "localhost",
//       port: 9090,
//       path: "/articles/",
//       method: "GET",
//     };

//     const req = https.request(options, (res) => {
//       console.log(`statusCode: ${res.statusCode}`);

//       res.on("data", (d) => {
//         process.stdout.write(d);
//         result = d["data"];
//         message = d["message"];
//         code = d["status"];
//       });
//     });

//     req.on("error", (error) => {
//       console.error(error);
//     });

//     req.end();

//     expect(result).toBe(expectedResult);
//     expect(code).toBe(expectedCode);
//     expect(message).toBe(expectedMessage);
//   });
// });

// describe("Test create article.", function () {
//   it("The endpoint will create new article with new data.", function () {
//     var message = null;
//     var code = null;
//     var expectedMessage = "Created";
//     var expectedCode = 201;

//     const data = new TextEncoder().encode(
//       JSON.stringify({
//         name: `${ARTICLE_1}`,
//         data: "Data for article 1.",
//       })
//     );
//     const options = {
//       hostname: "localhost",
//       port: 9090,
//       path: `/articles/${ARTICLE_1}`,
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         "Content-Length": data.length,
//       },
//     };
//     const req = https.request(options, (res) => {
//       console.log(`statusCode: ${res.statusCode}`);

//       res.on("data", (d) => {
//         process.stdout.write(d);
//       });
//     });

//     req.on("error", (error) => {
//       console.error(error);
//     });

//     req.write(data);
//     req.end();
//     expect(code).toBe(expectedCode);
//     expect(message).toBe(expectedMessage);
//   });
// });

// describe("Test update article.", function () {
//   it("The endpoint will update existing article with new data.", function () {
//     // TODO: Create an article on the back end
//     // Execute put request, and verify the article contents were updated.
//     // Delete article once test is done.
//     var message = null;
//     var code = null;
//     var expectedMessage = "OK";
//     var expectedCode = 200;

//     const data = new TextEncoder().encode(
//       JSON.stringify({
//         name: `${ARTICLE_1}`,
//         data: "Updated data for article 1.",
//       })
//     );
//     const options = {
//       hostname: "localhost",
//       port: 9090,
//       path: `/articles/${ARTICLE_1}`,
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         "Content-Length": data.length,
//       },
//     };
//     const req = https.request(options, (res) => {
//       console.log(`statusCode: ${res.statusCode}`);

//       res.on("data", (d) => {
//         process.stdout.write(d);
//       });
//     });

//     req.on("error", (error) => {
//       console.error(error);
//     });

//     req.write(data);
//     req.end();
//     expect(code).toBe(expectedCode);
//     expect(message).toBe(expectedMessage);
//   });
// });

// describe("Test get article.", function () {
//   it("The endpoint should return requested article from server.", function () {
//     // TODO: Add an article on the back-end.
//     // Verify article contents.
//     // Delete article once testing is done.
//     var code = null;
//     var message = null;
//     var articleName = null;
//     var content = null;

//     var expectedArticleName = `${ARTICLE_1}`;
//     var expectedContent = "Updated data for article 1.";
//     var expectedCode = 200;
//     var expectedMessage = "OK";

//     const options = {
//       hostname: "localhost",
//       port: 9090,
//       path: `/articles/${ARTICLE_1}`,
//       method: "GET",
//     };

//     const req = https.request(options, (res) => {
//       console.log(`statusCode: ${res.statusCode}`);

//       res.on("data", (d) => {
//         process.stdout.write(d);
//         articleName = d["data"]["document"];
//         content = d["data"]["data"];
//         message = d["message"];
//         code = d["status"];
//       });
//     });

//     req.on("error", (error) => {
//       console.error(error);
//     });

//     req.end();

//     expect(articleName).toBe(expectedArticleName);
//     expect(content).toBe(expectedContent);
//     expect(code).toBe(expectedCode);
//     expect(message).toBe(expectedMessage);
//   });
// });
