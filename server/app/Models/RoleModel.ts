import BaseModel from './BaseModel'

class RoleModel extends BaseModel {
  static tableName = "roles"

  //fields
  id: number;  
  code: string;
  name: string;
  description: string;
  key: string;
  others: any;  
  parentId: number;
  tenantId: number;
  createdBy: number;
  updatedBy: number;


  static async getChildrenRoles(roleId) {

    let results = [];
    if (!roleId) return results;
    let current = await this.getById(roleId);
    if (!current) return results;
    results.push(current);
    let parentIds = [roleId]
    let isContinue = true;

    while (isContinue) {
      let children = (parentIds.length) ? await this.query().whereIn("parentId", parentIds) : [];
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

}

export default RoleModel
