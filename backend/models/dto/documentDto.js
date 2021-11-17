import { Dto } from "./dto";

export class DocumentDto extends Dto {
  name = "";
  body = {};

  constructor() {
    super();
  }

  get() {
    this.name = "";
    this.body = {};
    return this;
  }

  getRandomDocument() {
    this.name = Math.random().toString(36).slice(2);
    this.body = Math.random().toString(36).slice(2);
    return this;
  }

  setName(name = "") {
    this.name = name;
    return this;
  }

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
