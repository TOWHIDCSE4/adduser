import BaseController from './BaseController'
import RoleModel from '@root/server/app/Models/RoleModel'
import UserModel from '@root/server/app/Models/UserModel'
import TenantsModel from '@root/server/app/Models/TenantsModel'
import ApiException from '@app/Exceptions/ApiException'
import constantConfig from '@config/constant'
import { removeVietnameseTones, hashNumber } from '@helpers/utils'
import _ from 'lodash'
const { roleKey } = constantConfig
import RolePermissionModel from "@root/server/app/Models/RolePermissionModel";
import PermissionModel from "@root/server/app/Models/PermissionModel";
import Logger from '@core/Logger'
const logger = Logger('Role');

export default class RoleController extends BaseController {
  Model: any = RoleModel
  UserModel: any = UserModel
  TenantsModel: any = TenantsModel
  PermissionModel: any = PermissionModel
  RolePermissionModel: any = RolePermissionModel
  async index() {
    const inputs = this.request.all();
    const { auth } = this.request;
    const project = ['roles.*', 'ag.name as parentName', 'tenants.name as tenantName']
    // let ChildrenRoles = await this.Model.getChildrenRoles(auth.roleId)
    // let ChildrenRolesIds = ChildrenRoles.map(item => item.id)
    let role = await this.Model.getById(auth.roleId);
    let tenantId = await this.UserModel.getTenantId(auth.id)
    let query = this.Model.query()
      .leftJoin('roles as ag', 'roles.parentId', 'ag.id')
      .leftJoin('tenants', 'roles.tenantId', 'tenants.id')
      .select(project)
      .whereNot('roles.key', 'root')
    if (role.key != 'root') {
      query = query
        .where('roles.tenantId', tenantId)
        // .whereIn("roles.parentId", ChildrenRolesIds)
    }
    let code = hashNumber(String(2));
    let result = await query.getForGridTable(inputs);
    return result;
  }

  async detail() {
    const allowFields = {
      id: "string!"
    }
    const { auth } = this.request
    let inputs = this.request.all();
    let params = this.validate(inputs, allowFields, { removeNotAllow: true });
    let user = await this.UserModel.getById(auth.id)
    logger.info(`Show detail role [usernameView:${user.username}] `)
    if (!user) {
      logger.error(`Critical:Show detail role ERR: user doesn't exist!`);
      throw new ApiException(6006, "User doesn't exist!")
    }
    let role = await this.Model.getOne({ id: user.roleId });
    let result = await this.Model.getOne({ code: params.id });
    if (!result || !role) {
      logger.error(`Critical:Show detail role ERR: role doesn't exist!`);
      throw new ApiException(6000, "Role doesn't exist!")
    }
    // per
    let permissions = []
    if (role.key == 'root' || role.key == 'Admin_BSEZ') {
      permissions = await this.PermissionModel.query().whereNot({ key: 'root' })
    } else {
      let allRole = await this.Model.query().where("tenantId", result.tenantId);
      if (!allRole || !allRole.length) {
        logger.error(`Critical:Show detail role ERR: Tenant role doesn't exist!`);
        throw new ApiException(6032, "Tenant role doesn't exist!")
      }
      let rolePermisstionParent = await this.RolePermissionModel.query().whereIn("roleId", allRole.map(item => item.id)) || [];
      let idPer = rolePermisstionParent.map(item => item.permissionId);
      permissions = await this.PermissionModel.query().whereNot({ key: 'root' }).whereIn("id", [...new Set(idPer)])
    }
    for (let index in permissions) {
      let permission = permissions[index]
      let resultPer = await permission.$relatedQuery('rolePermission').where('roleId', result.id).first()
      if (resultPer) permissions[index]['currentValue'] = resultPer.value
      else permissions[index]['currentValue'] = 0
    }
    result['permissions'] = [{
      permissions: permissions,
      name: result.name,
      id: result.id
    }]
    logger.info(`Show detail role [usernameView:${user.username},role:${JSON.stringify(result)}] `)
    return result
  }

  async select2() {
    const data = this.request.all()
    const { auth } = this.request;
    const allowFields = {
      id: "string"
    }
    let inputs = this.request.all();
    let params = this.validate(inputs, allowFields, { removeNotAllow: true });
    const project = [
      'name as label',
      'id as value',
      'code',
    ]
    let ChildrenRoles = await this.Model.getChildrenRoles(auth.roleId)
    let ChildrenRolesIds = ChildrenRoles.map(item => item.id)
    let exist = await this.Model.getById(auth.roleId);
    let tenantId = await this.UserModel.getTenantId(auth.id)
    let query = this.Model.query()
      .whereIn("id", ChildrenRolesIds)
    if (exist.key != 'root') {
      query.whereNot('roles.key', 'root')
        .where('roles.tenantId', tenantId)
    }
    if (params.id && params.id != 'undefined') {
      let idDis = await this.Model.getOne({ code: params.id });
      query.whereNot('roles.id', idDis.id)
    }
    let result = await query
      .select(project)
      .getForGridTable(data);
    return result;
  }

  async store() {
    const { auth } = this.request
    const allowFields = {
      name: "string!",
      description: "string",
      parentId: "number",
      tenantId: "number",
    }
    let inputs = this.request.all();
    let params = this.validate(inputs, allowFields, { removeNotAllow: true });

    let user = await this.UserModel.getById(auth.id)
    logger.info(`Created role [usernameCreated:${user.username}] `)
    if (!user) {
      logger.error(`Critical:Created role ERR: User doesn't exist!`);
      throw new ApiException(6006, "User doesn't exist!")
    }
    const { permissions } = inputs
    if (!permissions){
      logger.error(`Critical:Created role ERR: No data per!`);
      throw new ApiException(6005, "No data");
    } 
    
   
    let tenantId = null
    if (!params.tenantId) {
      tenantId = await this.UserModel.getTenantId(auth.id)
      if (!tenantId) {
        logger.error(`Critical:Created role ERR: Tenant doesn't exist!`);
        throw new ApiException(6032, "Tenant doesn't exist!")
      }
    } else {
      let checkTenant = await this.TenantsModel.getById(params.tenantId)
      if (!checkTenant) {
        logger.error(`Critical:Created role ERR: Tenant doesn't exist!`);
        throw new ApiException(6032, "Tenant doesn't exist!")
      }
      tenantId = checkTenant.id
    }
    let name = params.name.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
    let exist = await this.Model.findExist(name, 'name')
    if (exist) {
      logger.error(`Critical:Created role ERR: Role name already exists!`);
      throw new ApiException(6002, "Role name already exists!")
    }
    let parentExist = await this.Model.query().where({ id: user.roleId }).first();
    if (!parentExist){
      logger.error(`Critical:Created role ERR: Role doesn't exist!`);
      throw new ApiException(6000, "Role doesn't exist!")
    }
    let key = removeVietnameseTones(params.name)
    let result = await this.Model.insertOne({ ...params, parentId: parentExist.id, tenantId, createdBy: auth.id, key });
    let code = hashNumber(String(result.id));
    let resultUpdate = await this.Model.updateOne(result.id, { code: code });


    //per
    for (let keyPer in permissions) {
      const value = permissions[keyPer]
      const exist = await this.PermissionModel.getByKey(keyPer);
      if (!exist) throw new ApiException(7003, `${keyPer} doesn't exist`);

      const role = await this.RolePermissionModel.getByPermissionKey({ key: keyPer, roleId: result.id });
      // kiem tra gia tri moi cua quyen
      if (!value) { //truong hop xoa bo quyen cu
        await this.RolePermissionModel.query().delete().where({ roleId: result.id, key: keyPer });
      }
      else if (!role) { //quyen moi chua ton tai trong DB
        await this.RolePermissionModel.insertOne({
          key: keyPer,
          roleId: result.id,
          permissionId: exist.id,
          value, createdBy: auth.id
        });
      }
      else if (role.value != value) { //update lai gia tri moi
        await this.RolePermissionModel.updateOne(role.id, { value: value })
      }
    }
    logger.info(`Created role [usernameCreated:${user.username},role:${JSON.stringify(resultUpdate)}] `)

    return resultUpdate
  }

  async update() {

    const { auth } = this.request
    const allowFields = {
      id: "string!",
      name: "string!",
      description: "string",
      parentId: "number",
      tenantId: "number",
    }
    let inputs = this.request.all();
    let params = this.validate(inputs, allowFields, { removeNotAllow: true });

    let user = await this.UserModel.getById(auth.id)
    logger.info(`Updated role [usernameUpdate:${user.username}] `)
    if (!user) {
      logger.error(`Critical:Updated role ERR: User doesn't exist!`);
      throw new ApiException(6006, "User doesn't exist!")
    }

    const { permissions } = inputs
    if (!permissions) {
      logger.error(`Critical:Updated role ERR: No data per!`);
      throw new ApiException(6005, "No data");
    }
    let { id, parentId } = params
    delete params.id

    let exist = await this.Model.query().where({id: id}).first();
    if (!exist) {
      logger.error(`Critical:Updated role ERR: Role doesn't exist!`);
      throw new ApiException(6000, "Role doesn't exist!");
    }
    
    let existRoleName = await this.Model.findExist(params.name, 'name');
    if (existRoleName && existRoleName.id != id) {
      logger.error(`Critical:Updated role ERR: Role name already exists!`);
      throw new ApiException(6002, "Role name already exists!");
    }
    // let parentExist = await this.Model.getById(parentId);
    // if (!parentExist) throw new ApiException(6000, "Role doesn't exist!")
    let result = await this.Model.updateOne(id, { ...params, updatedBy: auth.id });
    if (params.tenantId) {
      let checkTenant = await this.TenantsModel.getById(params.tenantId)
      if (!checkTenant) {
        logger.error(`Critical:Updated role ERR: Tenant doesn't exist!`);
        throw new ApiException(6032, "Tenant doesn't exist!")
      }
    }
    for (let keyPer in permissions) {
      const value = permissions[keyPer]
      const exist = await this.PermissionModel.getByKey(keyPer);
      if (!exist) {
        logger.error(`Critical:Updated role ERR: ${keyPer} doesn't exist!`);
        throw new ApiException(7003, `${keyPer} doesn't exist`);
      }
      const role = await this.RolePermissionModel.getByPermissionKey({ key: keyPer, roleId: result.id });
      // kiem tra gia tri moi cua quyen
      if (!value) { //truong hop xoa bo quyen cu
        await this.RolePermissionModel.query().delete().where({ roleId: result.id, key: keyPer });
      }
      else if (!role) { //quyen moi chua ton tai trong DB
        await this.RolePermissionModel.insertOne({
          key: keyPer,
          roleId: result.id,
          permissionId: exist.id,
          value, createdBy: auth.id
        });
      }
      else if (role.value != value) { //update lai gia tri moi
        await this.RolePermissionModel.updateOne(role.id, { value: value })
      }
    }
    logger.info(`Updated role [usernameUpdate:${user.username},role:${JSON.stringify(result)}] `)

    return result
  }

  async destroy() {
    const { auth } = this.request
    let user = await this.UserModel.getById(auth.id)
    logger.info(`Destroy role [usernameDestroy:${user.username}] `)
    if (!user) {
      logger.error(`Critical:Destroy role ERR: User doesn't exist!`);
      throw new ApiException(6006, "User doesn't exist!")
    }

    const allowFields = {
      id: "number!"
    }
    const inputs = this.request.all();
    let params = this.validate(inputs, allowFields, { removeNotAllow: true });

    let role = await this.Model.getById(params.id);
    if (!role){
      logger.error(`Critical:Destroy role ERR: Role doesn't exist!`);
      throw new ApiException(6000, "Role doesn't exist!")
    }

    if (role.key === roleKey.root) {
      logger.error(`Critical:Destroy role ERR: Cannot delete root!`);
      throw new ApiException(6003, "Cannot delete root!")
    }

    let checkUser = await this.UserModel.query().where('roleId', role.id)
    if (!_.isEmpty(checkUser)) {
      logger.error(`Critical:Destroy role ERR: Role contains user cannot be deleted!`);
      throw new ApiException(6004, "Role contains user cannot be deleted!")
    }

    let result = await this.Model.deleteById(role.id);
    logger.info(`Destroy role [usernameDestroy:${user.username},role:${JSON.stringify(result)}] `)
    return result
  }

  async delete() {
    const { auth } = this.request
    let user = await this.UserModel.getById(auth.id)
    logger.info(`Deletes role [usernameDeletes:${user.username}] `)
    if (!user) {
      logger.error(`Critical:Deletes role ERR: User doesn't exist!`);
      throw new ApiException(6006, "User doesn't exist!")
    }

    const allowFields = {
      ids: ["number!"]
    }
    const inputs = this.request.all();
    let params = this.validate(inputs, allowFields);

    let roles = await this.Model.query().whereIn('id', params.ids);
    if (roles.length !== params.ids.length) {
      logger.error(`Critical:Deletes role ERR: Role doesn't exist!`);
      throw new ApiException(6000, "Role doesn't exist!")
    }

    let role = roles.find(role => role.key === roleKey.root)
    if (role) {
      logger.error(`Critical:Deletes role ERR: Cannot delete root!`);
      throw new ApiException(6003, "Cannot delete root!")
    }

    let checkUser = await this.UserModel.query().whereIn('roleId', params.ids)
    if (!_.isEmpty(checkUser)) {
      logger.error(`Critical:Deletes role ERR: Role contains user cannot be deleted!`);
      throw new ApiException(6004, "Role contains user cannot be deleted!")
    }

    let result = await this.Model.deleteByIds(params.ids);
    logger.info(`Deletes role [usernameDeletes:${user.username},role:${JSON.stringify(result)}] `)

    return result
  }
}
