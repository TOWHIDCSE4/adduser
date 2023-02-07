import BaseController from './BaseController'
import UserModel from '@root/server/app/Models/UserModel'
import RoleModel from '@app/Models/RoleModel'
import ApiException from '@app/Exceptions/ApiException'
import { removeVietnameseTones ,hashNumber ,makeKey} from '@helpers/utils'
import TenantsModel from '@app/Models/TenantsModel'
const speakeasy = require('speakeasy');
import Logger from '@core/Logger'
const logger = Logger('User');
export default class AdminController extends BaseController {
  Model: typeof UserModel = UserModel
  RoleModel: any = RoleModel
  TenantsModel: any = TenantsModel

  async index() {
    const { auth } = this.request;
    let inputs = this.request.all()
    let project = [
      "users.username",
      "users.firstName",
      "users.lastName",
      "users.email",
      "users.roleId",
      "users.code",
      "users.id",
      "tenants.name as tenantName",
      "roles.name as roleName",
      "users.createdAt",
      "ag.username as agUsername",
    ]
    // let getAccountsItCreated = await this.Model.getAccountsItCreated(auth.id)
    let tenantId = await this.Model.getTenantId(auth.id)
    // let getAccountsItCreatedId = getAccountsItCreated.map(item => item.id)

    let role = await this.RoleModel.getById(auth.roleId);
    let query = this.Model.query()
      .leftJoin('users as ag', 'users.createdBy', 'ag.id')
      .leftJoin('roles', 'users.roleId', 'roles.id')
      .leftJoin('tenants', 'users.tenantId', 'tenants.id')
      .whereNot('users.id', auth.id)

    if(role.key != 'root'){
      query = query
      .where('users.tenantId', tenantId)
      .whereNot('roles.key', 'root')
      // .whereIn('users.id',getAccountsItCreatedId)
    }

    let result = await query
      .select(project)
      .getForGridTable(inputs)
    return result;
  }

  async detail() {
    const { auth } = this.request
    const allowFields = {
      id: "string!"
    }
    let inputs = this.request.all();
    let user = await this.Model.query().where('id', auth.id).first()
    logger.info(`View Detail [usernameView:${user.username}] `)
    let params = this.validate(inputs, allowFields, { removeNotAllow: true });
    let result = await this.Model.getOne({ code: params.id });
    if (!result) {
      logger.error(`Critical:Show detail user ERR: user doesn't exist!`);
      throw new ApiException(6000, "user doesn't exist!")
    }
    logger.info(`Show detail user [usernameView:${user.username},username:${JSON.stringify(result)}] `)
    delete result['password']
    delete result['twofaKey']
    delete result['isFirst']
    delete result['twofa']
    return result
  }

  async store() {
    const { auth } = this.request
    let inputs = this.request.all()
    const allowFields = {
      firstName: "string!",
      lastName: "string!",
      username: "string!",
      password: "string!",
      roleId: "number!",
      email: "string!",
      twofa: "boolean",
      tenantId: "number"
    }
    let user = await this.Model.query().where('id', auth.id).first()
    logger.info(`Create user [username:${user.username}] `)
    let params = this.validate(inputs, allowFields, { removeNotAllow: true });
    let twoFa = typeof params.twofa === 'undefined' ? 1 : params.twofa ? 1 : 0;
    let tenantId = null
    if(!params.tenantId) {
      tenantId = await this.Model.getTenantId(auth.id)
      if(!tenantId){
        logger.error(`Critical:User created ERR: Tenant by auth doesn't exist!`);
        throw new ApiException(6000, "Tenant doesn't exist!")
      } 
    }else {
      let checkTenant = await this.TenantsModel.getById(params.tenantId)
      if(!checkTenant){
        logger.error(`Critical:User created ERR: Tenant doesn't exist! `);
        throw new ApiException(6000, "Tenant doesn't exist!")
      } 
      tenantId = checkTenant.id
    }
    let username = params.username.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
    let usernameExist = await this.Model.findExist(username, 'username')
    if (usernameExist){
      logger.error(`Critical:User created ERR: Username already exists! `);
      throw new ApiException(6007, "Username already exists!")
    } 

    let emailExist = await this.Model.findExist(params.email, 'email')
    if (emailExist) {
      logger.error(`Critical:User created ERR: Email already exists! `);
      throw new ApiException(6021, "Email already exists!")
    }

    let role = await this.RoleModel.getById(params.roleId)
    if (!role){
      logger.error(`Critical:User created ERR: User role not exists!`);
      throw new ApiException(6000, "User role not exists!")
    } 

    if (params['password']) params['password'] = await this.Model.hash(params['password']);
    let twofaKey = makeKey(32);
    do {
      twofaKey = makeKey(32);
    } while (!!await this.Model.getOne({ twofaKey: twofaKey }))

    params = {
      ...params,
      roleId: role.id,
      createdBy: auth.id,
      twofaKey: twofaKey,
      twofa: twoFa,
      isFirst: 1,
      tenantId: tenantId
    }
    let result = await this.Model.insertOne(params);
    logger.info(`Create user [username:${user.username},userCreted:${JSON.stringify(result)}] `)
    let code = hashNumber(String(result.id));
    let resultUpdate = await this.Model.updateOne(result.id, { code: code });
    delete resultUpdate['password']
    delete resultUpdate['twofaKey']
    delete resultUpdate['isFirst']
    delete resultUpdate['twofa']
    return resultUpdate
  }

  async update() {
    let inputs = this.request.all()
    const { auth } = this.request
    const allowFields = {
      id: "number!",
      firstName: "string!",
      lastName: "string!",
      email: "string!",
      twofa: "boolean"
    }
    let user = await this.Model.getById(auth.id)
    logger.info(`Update user [username:${user.username}] `)
    let params = this.validate(inputs, allowFields, { removeNotAllow: true });
    let twoFa = typeof params.twofa === 'undefined' ? 1 : params.twofa ? 1 : 0;
    const { id } = params
    delete params.id

    let exist = await this.Model.getById(id)
    if (!exist){
      logger.error(`Critical:User updated ERR: User doesn't exists!`);
      throw new ApiException(6006, "User doesn't exists!")
    } 

    let emailExist = await this.Model.getOne({ email: params.email })
    if (emailExist && emailExist.id !== exist.id){
      logger.error(`Critical:User updated ERR: Email already exists! `);
      throw new ApiException(6021, "Email already exists!")
    } 
    
    let dataUpdate = {
      ...params,
      twofa: twoFa 
    }

    let result = await this.Model.updateOne(id, { ...dataUpdate });
    logger.info(`Update user [username:${user.username},userUpdate:${JSON.stringify(result)}] `)
    delete result['password']
    delete result['twofaKey']
    delete result['isFirst']
    delete result['twofa']
    return {
      result,
      old: exist
    }
  }

  async destroy() {
    const { auth } = this.request
    let params = this.request.all();
    let id = params.id;
    if (!id) throw new ApiException(9996, "ID is required!");

    let exist = await this.Model.getById(id)
    if (!exist){
      logger.error(`Critical:User destroy ERR: User doesn't exists!`);
      throw new ApiException(6006, "User doesn't exists!")
    }
    if ([id].includes(auth.id)) throw new ApiException(6022, "You can not remove your account.")

    let user = await this.Model.query().where('id', params.id).first()
    await user.$query().delete()
    let userAuth = await this.Model.getById(auth.id)
    logger.info(`Destroy user [username:${userAuth.username},userDelete:${JSON.stringify(user)}] `)
    return {
      message: `Delete successfully`,
      old: user
    }
  }

  async delete() {
    const { auth } = this.request
    const allowFields = {
      ids: ["number!"]
    }
    const inputs = this.request.all();
    let params = this.validate(inputs, allowFields);

    let exist = await this.Model.query().whereIn('id', params.ids)
    if (!exist || exist.length !== params.ids.length){
      logger.error(`Critical:User delete ERR: User doesn't exists!`);
      throw new ApiException(6006, "User doesn't exists!")
    } 
    if (params.ids.includes(auth.id)){
      logger.error(`Critical:User delete ERR: You can not remove your account!`);
      throw new ApiException(6022, "You can not remove your account.")
    }

    let users = await this.Model.query().whereIn('id', params.ids)
    for (let user of users) {
      await user.$query().delete()
    }
    let userAuth = await this.Model.getById(auth.id)
    logger.info(`Detele user [username:${userAuth.username},listUserDelete:${JSON.stringify(users)}] `)
    return {
      old: {
        usernames: (users || []).map(user => user.username).join(', ')
      }
    };
  }

  async getInfo() {
    const { auth } = this.request;
    let result = await this.Model.getById(auth.id);
    logger.info(`Show info [username:${result.username}] `)
    delete result['password']
    delete result['twofaKey']
    delete result['isFirst']
    if (!result){
      logger.error(`Critical:User getInfo ERR: User doesn't exist!`);
      throw new ApiException(6006, "User doesn't exist!")
    }
    
    return result
  }

}
