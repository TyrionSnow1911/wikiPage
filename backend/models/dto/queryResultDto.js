import { Dto } from "./dto";

export class QueryResultDto extends Dto {
  header = {};
  message = "";
  statusCode = null;
  documents = [];

  constructor() {
    super();
  }

  /**
   * @returns {QueryResultDto}
   */
  get() {
    this.header = { "Content-Type": "application/json" };
    this.message = "";
    this.statusCode = null;
    this.documents = [];
    return this;
  }

  /**
   * @returns {QueryResultDto}
   */
  setHeader(header = {}) {
    this.header = header;
    return this;
  }

  /**
   * @returns {QueryResultDto}
   */
  setMessage(message = "") {
    this.message = message;
    return this;
  }

  /**
   * @returns {QueryResultDto}
   */
  setStatus(statusCode = null) {
    this.statusCode = statusCode;
    return this;
  }

  /**
   * @returns {QueryResultDto}
   */
  setDocuments(documents = []) {
    this.documents = documents;
    return this;
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
