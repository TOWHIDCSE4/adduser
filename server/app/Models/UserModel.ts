import BaseModel from './BaseModel'
import ApiException from '@app/Exceptions/ApiException'
import RoleModel from "./RoleModel"
const bcrypt = require("bcrypt")
const authConfig = require("@config/auth")
import redis from '@app/Services/Redis/index'
const speakeasy = require('speakeasy');
import TenantsModel from "./TenantsModel"
import Logger from '@core/Logger'
const logger = Logger('User');
class UserModel extends BaseModel {
  static tableName = "users"

  //fields
  id: number;
  code: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  birthday: any;
  phone: number;
  others:any;
  twofa: number;
  twofaKey: string;
  isFirst: number;
  roleId: number;
  tenantId: number;
  createdBy: number;
  updatedBy: number;

  static get relationMappings() {
    return {
      group: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: RoleModel,
        join: {
          from: `${this.tableName}.roleId`,
          to: 'roles.id'
        }
      }
    }
  }

  static async checkLogin({ username, password }) {
    const user = await this.query().findOne({ username: username });
    if (!user) return false;

    let checkPassword = await this.compare(password, user.password);
    delete user.password;
    if (checkPassword) return user;
    return false;
  }

  static async veriy2FA({ code, tokenVerify }: { code: string, tokenVerify: string }) {
    const user = await this.query().findOne({ code: code });
    if (!user) return false;
    let checkInRedis = await redis.get(`2FA:${code}`)
    if (!checkInRedis){
      logger.error(`Critical:Check reset Password ERR: Token has expired`);
      throw new ApiException(401, "Need login first", {redirect: "/login"})
    } 
    let verified = speakeasy.totp.verify({
      secret: user.twofaKey,
      encoding: 'ascii',
      token: tokenVerify,
      window: 1,
    });
    delete user.password;
    delete user.twofaKey;
    delete user.twofa;
    delete user.isFirst;
    if(verified){
      await redis.del(`2FA:${code}`)
      return user;
    } 
    return false;
  }

  static async hash(plainPassword) {
    return await bcrypt.hash(plainPassword + authConfig.SECRET_KEY, 10)
  }

  static async compare(plainPassword, encryptedPassword) {
    return await bcrypt.compare(plainPassword + authConfig.SECRET_KEY, encryptedPassword)
  }

  async changePassword(newPassword) {
    newPassword = await UserModel.hash(newPassword)
    return await this.$query().patchAndFetchById(this.id, {
      password: newPassword
    })
  }

  static async getInfoAuth(auth) {
    let result = await this.query().withGraphJoined('group').where('users.id', auth.id).first()
    if (!result) throw new ApiException(6006, "User doesn't exist!")
    return result
  }

  static async getAccountsItCreated(userId) {

    let results = [];
    if (!userId) return results;
    let current = await this.getById(userId);
    if (!current) return results;
    results.push(current);
    let parentIds = [userId]
    let isContinue = true;

    while (isContinue) {
      let children = (parentIds.length) ? await this.query().whereIn("createdBy", parentIds) : [];
      if (children.length) {
        results = results.concat(children);
        parentIds = children.map(e => e.id);
        parentIds = parentIds.filter(e => e);
      } else {
        isContinue = false;
      }
    }


    return results;
  }

  static async getTenantId(userId) {
    if (!userId) return null;
    let current = await this.getById(userId);
    if (!current || !current.tenantId) return null;
    let checkTenant = await TenantsModel.query().where('id', current.tenantId).first();
    if (!checkTenant) return null;
    return checkTenant.id;
  }
}

export default UserModel
