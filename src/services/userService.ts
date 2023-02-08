import Base from "./baseService";

class usersService extends Base {
	index = async (filter: any) => {
		return this.request({
			url: "/api/v1/users",
			method: "GET",
			data: filter,
		});
	};

	create = async (data: any) => {
		return this.request({
			url: "/api/v1/users",
			method: "POST",
			data: data,
		});
	};

	detail = async (data: any) => {
		return this.request({
			url: "/api/v1/users/:id",
			method: "GET",
			data: data,
		});
	};

	edit = async (data: any) => {
		return this.request({
			url: "/api/v1/users/:id",
			method: "PUT",
			data: data,
		});
	};

	delete = async (data: any) => {
		return this.request({
			url: "/api/v1/users",
			method: "DELETE",
			data: data,
		});
	};

	destroy = async (data: any) => {
		return this.request({
			url: "/api/v1/users/:id",
			method: "DELETE",
			data: data,
		});
	};

	getInfo = async () => {
		return this.request({
			url: "/api/v1/users/getInfo",
			method: "GET",
		});
	};

	changeState2FA = async () => {
		return this.request({
			url: "/api/v1/changeState2FA",
			method: "POST",
		});
	};

	async userCheckToken({ data }: { data: { token: string } }) {
		return this.request({
			url: "/api/v1/userCheckToken/:token",
			method: "GET",
			data: data,
		});
	}
}

export default () => new usersService();
