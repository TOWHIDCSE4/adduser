import BaseModel from './BaseModel'
import RolePermissionModel from './RolePermissionModel'

class PermissionModel extends BaseModel {
  static tableName = "permissions"

  //fields
  id: number;
  name: string;
  description: any;
  value: number;
  key: string;
  createdBy: number;

  static get relationMappings() {
    return {
      rolePermission: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: RolePermissionModel,
        join: {
          from: `${this.tableName}.id`,
          to: 'role_permissions.permissionId'
        }
      }
    }
  }

  static async getByKey(key){
    return await this.getOne({key})
  }
}

export default PermissionModel
