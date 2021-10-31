import { Dto } from "./dto";

export class QueryDto extends Dto {
  constructor() {
    super();
  }

  get() {
    this.header = { "Content-Type": "application/json" };
    this.message = "";
    this.statusCode = null;
    this.document = {};
    return this;
  }

  setHeader(header = {}) {
    this.header = header;
  }
  setMessage(message = "") {
    this.message = message;
  }
  setStatus(statusCode = null) {
    this.statusCode = statusCode;
  }
  setDocument(document = {}) {
    this.document = document;
  }

  getHeader() {
    return this.header;
  }
  getMessage() {
    return this.message;
  }
  getStatusCode() {
    return this.statusCode;
  }
  getDocument() {
    return this.document;
  }
}
