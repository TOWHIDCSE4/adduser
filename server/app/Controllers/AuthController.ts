import BaseController from './BaseController'
import Model from '@root/server/app/Models/UserModel'
import RoleModel from '@root/server/app/Models/RoleModel';
import RolePermissionModel from '@root/server/app/Models/RolePermissionModel';
import ApiException from '@app/Exceptions/ApiException'
import Auth from '@libs/Auth'
import authConfig from '@config/auth'
import to from 'await-to-js'
import redis from '@app/Services/Redis/index'
const speakeasy = require('speakeasy');
import MailService from '@root/server/app/Services/Mail'
import { removeVietnameseTones, hashNumber, makeKey } from '@helpers/utils'
import Logger from '@core/Logger'
const logger = Logger('Auth');

export default class AuthController extends BaseController {
  Model: any = Model
  RoleModel: any = RoleModel
  RolePermissionModel: any = RolePermissionModel

  async login() {
    const inputs = this.request.all();
    const allowFields = {
      username: "string!",
      password: "string!"
    }

    const data = this.validate(inputs, allowFields, { removeNotAllow: true });
    let user = await this.Model.checkLogin({
      username: data.username,
      password: data.password
    })
    logger.info(`Login [username:${data.username}] `)
    if (!user) {
      logger.error(`Critical: CheckLogin ERR:${JSON.stringify(user)}`);
      throw new ApiException(7000, "Can not login")
    }

    if (!user.twofa) {
      let role = await this.RoleModel.getById(user.roleId)
      if (!role){
        logger.error(`Critical:Check Role ERR:${JSON.stringify(role)}`);
        throw new ApiException(6000, "User role doesn't exist!")
      } 

      let permissions = await this.RolePermissionModel.getPermissions(role.id);

      let token = Auth.generateJWT({
        id: user.id,
        username: user.username,
        permissions: permissions,
        roleId: user.roleId
      }, {
        key: authConfig['SECRET_KEY_ADMIN'],
        expiresIn: authConfig['JWT_EXPIRE_ADMIN']
      });
      delete user.twofaKey;
      delete user.isFirst;
      return {
        token,
        user: {
          ...user,
          permissions
        }
      }
    }
    else {
      redis.set(`2FA:${user.code}`, `${user.code}`, "EX", authConfig['JWT_EXPIRE_2FA'])
      let permissions = await this.RolePermissionModel.getPermissionsVerify();
      let token = Auth.generateJWT({
        id: user.id,
        username: user.username,
        permissions: permissions,
        roleId: user.roleId
      }, {
        key: authConfig['SECRET_KEY_ADMIN'],
        expiresIn: authConfig['JWT_EXPIRE_2FA']
      });
      if (user.isFirst) {
        return {
          token,
          user: {
            code: user.code,
            username: user.username,
            twofa: user.twofa,
            twofaKey: user.twofaKey,
            isFirst: user.isFirst,
            permissions
          }
        }
      } else {
        return {
          token,
          user: {
            code: user.code,
            username: user.username,
            twofa: user.twofa,
            isFirst: user.isFirst,
            permissions
          }
        }
      }
    }
  }

  async AuthTwofa() {
    const inputs = this.request.all();
    const allowFields = {
      code: "string!",
      tokenVerify: "string!"
    }

    const data = this.validate(inputs, allowFields, { removeNotAllow: true });
    let user = await this.Model.veriy2FA({
      code: data.code,
      tokenVerify: data.tokenVerify
    })
    if (!user) {
      logger.error(`Critical:Veriy 2FA ERR:${JSON.stringify(user)}`);
      throw new ApiException(6023, "Code verify is not correct")
    }
    let role = await this.RoleModel.getById(user.roleId)
    if (!role){
      logger.error(`Critical:Check Role ERR:${JSON.stringify(role)}`);
      throw new ApiException(6000, "User role doesn't exist!")
    }
    let permissions = await this.RolePermissionModel.getPermissions(role.id);
    let token = Auth.generateJWT({
      id: user.id,
      username: user.username,
      permissions: permissions,
      roleId: user.roleId
    }, {
      key: authConfig['SECRET_KEY_ADMIN'],
      expiresIn: authConfig['JWT_EXPIRE_ADMIN']
    });
    if(user.isFirst != 0) {
      await this.Model.query().where('id',user.id).update({isFirst:0})
    }
    logger.info(`Verify Twofa [username:${user.username}] `)
    delete user.twofaKey;
    delete user.isFirst;
    return {
      token,
      user: {
        ...user,
        permissions
      }
    }
  }

  async logout() {
    const inputs = this.request.all();
    const { auth } = this.request;
    const allowFields = {
      username: "string!",
    }
    const data = this.validate(inputs, allowFields, { removeNotAllow: true });

    let tokenOld = auth.token
    let TimeExp = auth.exp - Date.now() / 1000
    redis.set(`${tokenOld}`, `${tokenOld}`, "EX", TimeExp.toFixed())
    logger.info(`Logout [username:${data.username}] `)
    return data
  }

  async forgotPassword() {
    const allowFields = {
      email: "string!",
    }
    let inputs = this.request.all()
    let params = this.validate(inputs, allowFields, { removeNotAllow: true });

    let exist = await this.Model.getOne({ email: params.email })
    // throw new ApiException(6006, "User does't exist!")
    if (exist) {
      //sent email
      let variables = {
        resetPasswordLink: this.makeForgotPasswordLink(exist),
        name: exist.firstName + " " + exist.lastName,
        email: exist.email,
      }
      let subject = "KDDI Account — Reset your password"
      let content = `<div style="width: 100%;
      height: 300px;
      text-align: center;
      color: rgb(255, 255, 255);
      padding: 3px;
      font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #364574;
      ">
  <h1>Application-Platform</h1>
  <div style="
          max-width: 640px;
          height: 180px;
          text-align: center;
          background-color: #fff;
          border: solid 1px rgb(218, 218, 218);
          color: #364574;
          padding: 5px;
          margin: auto;">
    <h2>Reset your KDDI Account password</h2>
    <a href="{{resetPasswordLink}}" style="
                  text-align: center;
                  text-decoration: none;
                  display:inline-block;
                  padding: 14px 25px;
                  font-weight: bold;
                  background-color: #0AB39C;
                  color: #ffffff">
      Reset Password</a>
    <br />
    <h4>This password reset will expire in ${authConfig['JWT_EXPIRE_VERYFY_EMAIL'] / 60} minutes.</h4>
  </div>
</div>
      `
      MailService.send(exist.email, subject, content, variables)
      logger.info(`ForgotPassword [email:${params.email}] `)
      return exist
    }
    return
  }


  makeForgotPasswordLink(user) {
    let token = Auth.generateJWT({
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email
    }, {
      key: authConfig['SECRET_KEY_ADMIN'],
      expiresIn: authConfig['JWT_EXPIRE_VERYFY_EMAIL']
    })
    redis.set(`ForgotPassword:${user.id}`, `${token}`, "EX", authConfig['JWT_EXPIRE_VERYFY_EMAIL'])
    return `${this.request.get('origin')}/reset-password/${token}`
  }

  async checkToken() {
    const allowFields = {
      token: "string!"
    }
    let inputs = this.request.all()
    let params = this.validate(inputs, allowFields, { removeNotAllow: true });

    let [error, auth] = await to(Auth.verify(params.token, {
      key: authConfig['SECRET_KEY_ADMIN']
    }))
    if (error){
      logger.error(`Critical:Check reset Password ERR: The token has expired`);
      logger.error(`Critical:Check reset Password ERR: ${error}`);
      throw new ApiException(6012, "The token has expired")

    } 
    let user = await this.Model.getById(auth.id);
    logger.info(`Check Token [username:${user.usermane}] `)
    if (!user){
      logger.error(`Critical:Check User ERR: User doesn't exist!`);
      throw new ApiException(6006, "User doesn't exist!")
    } 

    delete user.password

    return user
  }

  async resetPassword() {
    const allowFields = {
      token: "string!",
      newPassword: "string!"
    }
    let inputs = this.request.all()
    let params = this.validate(inputs, allowFields, { removeNotAllow: true });
    let [error, auth] = await to(Auth.verify(params.token, {
      key: authConfig['SECRET_KEY_ADMIN']
    }))
    let TokenInRedis
    if (error){
      logger.error(`Critical:Check reset Password ERR: The token has expired`);
      logger.error(`Critical:Check reset Password ERR: ${error}`);
      throw new ApiException(6012, "The token has expired")
    } 
    await redis.get(`ForgotPassword:${auth.id}`).then(res => {
      TokenInRedis = res
    })
    if (TokenInRedis != params.token) throw new ApiException(7004, "Please use the latest link")
    let user = await this.Model.getById(auth.id);
    if (!user) throw new ApiException(6006, "User doesn't exist!")

    let hash = await this.Model.hash(params.newPassword)
    let twofaKey = makeKey(32);
    do {
      twofaKey = makeKey(32);
    } while (!!await this.Model.getOne({ twofaKey: twofaKey }))
    logger.info(`Reset Password [username:${user.usermane}] `)
    let result = await this.Model.updateOne(user.id, { password: hash, isFirst: 1, twofaKey: twofaKey })
    return 
  }

  async changePassword() {
    let inputs = this.request.all()
    const allowFields = {
      password: "string!"
    }
    let data = this.validate(inputs, allowFields, { removeNotAllow: true });
    const auth = this.request.auth || {};
    const id = auth.id;

    let user = await this.Model.query().findById(id);
    if (!user) throw new ApiException(6006, "User doesn't exist!")

    let result = await user.changePassword(data['password'])
    delete result['password']
    logger.info(`Reset Password [username:${user.usermane}] `)
    return result
  }

  async refreshToken() {
    let input = this.request.all()
    const { auth } = this.request
    const allowFields = {
      isApp: "boolean",
    }
    let data = this.validate(input, allowFields)

    let user = await this.Model.getOne({ id: auth.id })
    if (!user) throw new ApiException(6006, "User doesn't exist")

    let role = await this.RoleModel.getById(user.roleId)
    if (!role) throw new ApiException(6000, "User role doesn't exist!")

    let permissions = await this.RolePermissionModel.getPermissions(role.roleId);

    let tokenNew = Auth.generateJWT({
      id: user.id,
      username: user.username,
      permissions: permissions,
      roleId: role.id,
    }, {
      key: authConfig['SECRET_KEY_ADMIN'],
      expiresIn: authConfig['JWT_REFRESH_TIME']
    });

    let tokenOld = auth.token
    let TimeExp = auth.exp - Date.now() / 1000
    redis.set(`${tokenOld}`, `${tokenOld}`, "EX", TimeExp.toFixed())

    return {
      token: tokenNew
    }
  }

  async changeState2FA() {
    const { auth } = this.request;
    let user = await this.Model.getById(auth.id);
    logger.info(`Change State 2FA [username:${user.username}] `)
    if (!user){
      logger.error(`Critical:Change State 2FA ERR: User doesn't exist!`);
      throw new ApiException(6006, "User doesn't exist!")
    }
    await user.$query().update({ twofa: user.twofa ? 0 : 1 })
    return 'success'
  }
}