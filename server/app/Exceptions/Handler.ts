const _ = require('lodash')
//const messageConfig = require('@config/message')

class ExceptionHandler {
  /**
   *
   * @param {httpCode, code, message, data} error
   * @param request
   * @param response
   */
  async handle(error, {request, response}) {
    let code = 500, message = "", data = {}, httpCode = 200;
    if (typeof error !== "object") {
      error = new Error(error)
    }
    code = Number(error.code) || 500;
    message = error.message || "";
    data = error.data || error.stack || {};
    httpCode = error.httpCode || 200
    console.log("ERROR:",error);

    const exceptionName = error.constructor.name;
    //message = this.makeMessage({code, message, data, extendCode})


    response.status(httpCode).send({
      code,
      message,
      data
    })
  }

}

export default ExceptionHandler