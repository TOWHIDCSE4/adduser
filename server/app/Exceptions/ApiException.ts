import Exception from "@core/Exception";

class ApiException extends Exception {

  constructor(code: number | string ="", message = "", data?) {
    super(code, message, data, 400);
  }
}

export default ApiException;
