import to from 'await-to-js'
import BaseMiddleware from './BaseMiddleware'
import Auth from '@libs/Auth'
import authConfig from '@config/auth'
const Cookies = require('universal-cookie')
import nextCookie from 'next-cookies'
import redis from '@app/Services/Redis/index'
import Logger from '@core/Logger'
const logger = Logger('Auth');
class AuthApiMiddleware extends BaseMiddleware {
  cookies: any
  constructor(request, response, next) {
    super(request, response, next);
    let cookie: any = this.getBearerTokenFromHeader(request)
    if (cookie.error) {
      cookie = nextCookie({
        req: this.request
      })
    }
    this.cookies = new Cookies(cookie);
    this.checkToken().then(res => {
      if (res.error) return response.status(401).json({ code: 401, error: res.error })
      next();
    }).catch(err => {
      console.log(err)
      return response.status(401).json({ code: 401, error: err })
    })
  }

  getBearerTokenFromHeader(req) {
    if (!req.headers.authorization) {
      return { error: 'Missing access token' };
    }
    const BEARER = 'Bearer';
    let token = req.headers.authorization.trim();
    if (!token || token.length == 0) {
      return { error: 'Missing access token' };
    }
    let index = token.indexOf(BEARER);
    if (index == 0) {
      token = token.substring(BEARER.length, token.length);
    } else {
      return { error: 'Missing token type ' + BEARER };
    }
    return { token: token.trim() };
  }

  async checkToken() {
    let token = this.cookies.get('token')
    let [error, result]: [any, any] = await to(Auth.verify(token, {
      key: authConfig['SECRET_KEY_ADMIN']
    }));
    if (error) return { error: error.message };
    let oldToken
    await redis.get(`${token}`).then(res => {
      oldToken = res
    })
    if (oldToken){
      logger.error(`Critical:Check reset Password ERR: Token has expired`);
      logger.error(`Critical:Check reset Password ERR: ${error}`);
      return { error: "Token has expired" }
    } 
    /* if(result.type !== "admin"){
      return this.response.error(403, "not access")
    } */
    if (result.exp - Date.now() / 1000 < authConfig['JWT_REFRESH_TIME']) {
      let newToken = Auth.generateJWT({
        id: result.id,
        username: result.username,
        permissions: result.permissions,
        groupId: result.groupId,
        roleGroupId: result.roleGroupId,
        type: result.type
      }, {
        key: authConfig['SECRET_KEY_ADMIN'],
        expiresIn: authConfig['JWT_EXPIRE_ADMIN']
      });
      this.response.set('Access-Control-Expose-Headers', 'access-token')
      this.response.set('access-token', newToken);
    }
    this.request.auth = this.makeAuthObject(result);
    this.request.auth.token = token;
    return { token };
  }

  makeAuthObject(tokenData) {
    return {
      ...tokenData
    }
  }
}

module.exports = AuthApiMiddleware.export();
