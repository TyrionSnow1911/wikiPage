import { Dto } from "./dto";

export class QueryResultDto extends Dto {
  header = {};
  message = "";
  statusCode = null;
  documents = [];

  constructor() {
    super();
  }

  get() {
    this.header = { "Content-Type": "application/json" };
    this.message = "";
    this.statusCode = null;
    this.documents = [];
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
  setDocuments(documents = []) {
    this.documents = documents;
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
  getDocuments() {
    return this.documents;
  }
}
