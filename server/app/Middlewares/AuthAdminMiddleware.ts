import to from "await-to-js";
import BaseMiddleware from "./BaseMiddleware";
import Auth from "@libs/Auth";
import authConfig from '@config/auth';
import Cookies from 'universal-cookie';
const { PREFIXADMIN } = authConfig

class AuthAdminMiddleware extends BaseMiddleware {
  cookies: any
  constructor(request, response, next) {
    super(request, response, next);
    this.cookies = new Cookies(request.headers.cookie);
    this.checkToken().then(res => {
      if (res.error) {
        console.log(res.error)
        response.redirect(`/${PREFIXADMIN}/login`)
        return;
      }
      next();
    }).catch(err => {
      return response.status(401).json({ error: err })
    })
  }

  async checkToken() {
    let token = this.cookies.get('token')
    let [error, result] = await to(Auth.verify(token, {
      key: authConfig['SECRET_KEY_ADMIN']
    }));
    if (error) return { error: error.message };
    // if(result.type !== PREFIXADMIN){
    //   return { code: 403, error: "Not access" }
    // }
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
      this.response.set('access-token', newToken.token);
    }
    this.request.auth = this.makeAuthObject(result);
    return { token };
  }

  makeAuthObject(tokenData) {
    return {
      ...tokenData
    }
  }
}

module.exports = AuthAdminMiddleware.export();
