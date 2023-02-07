import Base from "./baseService";

class roleService extends Base {
  index = async (filter: any) => {
    return this.request({
      url: "/api/v1/roles",
      method: "GET",
      data: filter,
    });
  };

  select2 = async (filter: any) => {
    return this.request({
      url: "/api/v1/roles/select2",
      method: "GET",
      data: filter,
    });
  };

  selectParent = async (filter: any) => {
    return this.request({
      url: "/api/v1/roles/selectParent",
      method: "GET",
      data: filter,
    });
  };

  create = async (data: any) => {
    return this.request({
      url: "/api/v1/roles",
      method: "POST",
      data: data,
    });
  };

  detail = async (data: any) => {
    return this.request({
      url: "/api/v1/roles/:id",
      method: "GET",
      data: data,
    });
  };

  edit = async (data: any) => {
    return this.request({
      url: "/api/v1/roles/:id",
      method: "PUT",
      data: data,
    });
  };

  delete = async (data: any) => {
    return this.request({
      url: "/api/v1/roles",
      method: "DELETE",
      data: data,
    });
  };

  destroy = async (data: any) => {
    return this.request({
      url: "/api/v1/roles/:id",
      method: "DELETE",
      data: data,
    });
  };
}

export default () => new roleService();
