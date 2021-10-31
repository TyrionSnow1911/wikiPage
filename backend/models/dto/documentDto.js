import { Dto } from "./dto";

export class DocumentDto extends Dto {
  constructor() {
    super();
  }

  get() {
    this.name = "";
    this.body = {};
    return this;
  }

  setName(name = "") {
    this.name = name;
  }

  setBody(body = {}) {
    this.body = body;
  }

  getName() {
    return this.name;
  }
  getBody() {
    return this.body;
  }
}
