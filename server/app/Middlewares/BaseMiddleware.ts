import { Response } from "express";

class BaseMiddleware {
    request: any
    response: any
    next: Function
    constructor(request?, response?, next?) {
      this.request = request;
      this.response = response;
      this.next = next
    }
  
    static export() {
      return (...params) => new (this)(...params)
    }
  }
  
  export default BaseMiddleware;
  