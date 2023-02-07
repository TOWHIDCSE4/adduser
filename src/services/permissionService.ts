import Base from "./baseService";

class RolePermissionService extends Base {
  getPermissionByRoleCode = async (data: {roleCode: string}) => {
    return this.request({
      url: "/api/v1/rolePermissions/getPermissionByGroupId",
      method: "GET",
      data: data,
    });
  }
  
  getPermissionByTenantId = async () => {
    return this.request({
      url: "/api/v1/rolePermissions/getPermissionByTenantId",
      method: "GET",
    });
  }
}

export default () => new RolePermissionService();
