import Base from "./baseService";

class RolePermissionService extends Base {
  update = async (data: any) => {
    return this.request({
      url: "/api/v1/rolePermissions/update",
      method: "PUT",
      data: data,
    });
  }
}

export default () => new RolePermissionService();
