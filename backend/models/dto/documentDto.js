import { Dto } from "./dto";

export class DocumentDto extends Dto {
  name = "";
  body = {};

  constructor() {
    super();
  }

  /**
   * @returns {DocumentDto}
   */
  get() {
    this.name = "";
    this.body = {};
    return this;
  }

  /**
   * @returns {DocumentDto}
   */
  setName(name = "") {
    this.name = name;
    return this;
  }

  /**
   * @returns {DocumentDto}
   */
  setBody(body = {}) {
    this.body = body;
    return this;
  }

  getName() {
    return this.name;
  }
  getBody() {
    return this.body;
  }
}
