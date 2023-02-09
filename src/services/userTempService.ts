import Base from "./baseService";

class userTempsService extends Base {
	index = async (filter: any) => {
		return this.request({
			url: "/api/v1/userTemps",
			method: "GET",
			data: filter,
		});
	};

	create = async (data: any) => {
		return this.request({
			url: "/api/v1/userTemps",
			method: "POST",
			data: data,
		});
	};

	detail = async (data: any) => {
		return this.request({
			url: "/api/v1/userTemps/:id",
			method: "GET",
			data: data,
		});
	};

	edit = async (data: any) => {
		return this.request({
			url: "/api/v1/userTemps/:id",
			method: "PUT",
			data: data,
		});
	};

	delete = async (data: any) => {
		return this.request({
			url: "/api/v1/userTemps",
			method: "DELETE",
			data: data,
		});
	};

	destroy = async (data: any) => {
		return this.request({
			url: "/api/v1/userTemps/:id",
			method: "DELETE",
			data: data,
		});
	};

	register = async (data: any) => {
		return this.request({
			url: "/api/v1/register",
			method: "POST",
			data: data,
		});
	};

	verifyToken = async ({ data }: { data: { token: string } }) => {
		return this.request({
		  url: "/api/v1/verifyToken/:token",
		  method: "GET",
		  data: data,
		});
	  }
}

export default () => new userTempsService();