import BaseMiddleware from './BaseMiddleware'
import Logger from '@core/Logger'

const logger = Logger('api');

/**
 * Mở rộng chức năng của response
 * success(data): gọi hàm khi có dữ liệu
 * error(code, message, data): gọi hàm khi có lỗi
 */

class ExtendMiddleware extends BaseMiddleware {
  constructor(request, response, next) {
    super(request, response, next);
    this.request = request;
    this.response = response;

    let id = Date.now() + '' + Math.floor(Math.random() * 1000000000);
    let params = JSON.parse(JSON.stringify(this.all()))
    delete params.idImages
    if (params.profile && params.profile.idImages) {
      delete params.profile.idImages
    }
    logger.info(`REQUEST [${id}] ${JSON.stringify({
      method: this.request.method,
      url: this.request.originalUrl,
      headers: this.request.headers,
      data: params
    })}`)

    response.requestId = id;
    // extend request
    request.all = this.all.bind(this);
    request.getHeaders = this.getHeaders.bind(this);

    // extend response
    response.success = this.success.bind(this);
    response.error = this.error.bind(this);
    this.response.sent = 0;
    next()
  }

  getHeaders() {
    return {
      authUser: this.request.authUser,
      lang_code: this.request.headers.lang_code,
      role_code: this.request.headers.role_code,
      userAgent: this.request.headers['user-agent'],
      authorization: this.request.headers.authorization,
      other: this.request.headers
    }
  }

  all() {
    let p = {};
    Object.assign(p, this.request.query);    // url query string, e.g api/users?param1=x&param2=y
    Object.assign(p, this.request.body);     // json parameters
    Object.assign(p, this.request.params);   // url parameters, e.g api/users/:id
    return p;
  }

  success(data = null, httpCode = 200) {
    this.auditLog(data);
    if (this.response.sent) {
      logger.info(`RESPONSE [${this.response.requestId}][OK-DUP]${JSON.stringify({
        data: data
      })}`)
      return;
    }
    logger.info(`RESPONSE [${this.response.requestId}][OK] ${JSON.stringify({
      data: data
    })}`)
    this.response.sent = 1;
    this.response.json({
      code: 200,
      data: data
    });
  }

  handleError(errorCode, err, info, httpCode = 200) {
    let data: any = {
      code: errorCode,
      info: info
    };
    if (typeof err === 'string' || err instanceof String) {
      data.message = err;
    }
    this.response.sent = 1;
    this.response.status(httpCode).send(data);
  }

  error(errorCode, err, info, httpCode) {
    this.auditLog({
      errorCode: errorCode,
      error: err,
      info: info,
      httpCode: httpCode
    });
    if (this.response.sent) {
      logger.info(`RESPONSE [${this.response.requestId}][ERROR-DUP]${JSON.stringify({
        errorCode: errorCode,
        error: err,
        info: info,
        httpCode: httpCode
      })}`)
      return;
    }
    logger.info(`RESPONSE [${this.response.requestId}][ERROR] ${JSON.stringify({
      errorCode: errorCode,
      error: err,
      info: info,
      httpCode: httpCode
    })}`)
    this.handleError(errorCode, err, info, httpCode);
  }

  async auditLog(data) {
    const auth = this.request.auth || {};
    const { controller, action } = this.request.audit || {};
  }
}

module.exports = ExtendMiddleware.export();
