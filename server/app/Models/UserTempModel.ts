import BaseModel from "./BaseModel";
import RoleModel from "./RoleModel";
const bcrypt = require("bcrypt");
const authConfig = require("@config/auth");

class UserTempModel extends BaseModel {
	static getTenantId(id: any) {
		throw new Error("Method not implemented.");
	}
	static tableName = "user_temps";

	//fields
	id: number;
	username: string;
	password: string;
	email: string;
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
					to: "roles.id",
				},
			},
		};
	}

	static async hash(plainPassword) {
		return await bcrypt.hash(plainPassword + authConfig.SECRET_KEY, 10);
	}

	static async compare(plainPassword, encryptedPassword) {
		return await bcrypt.compare(
			plainPassword + authConfig.SECRET_KEY,
			encryptedPassword
		);
	}

	async changePassword(newPassword) {
		newPassword = await UserTempModel.hash(newPassword);
		return await this.$query().patchAndFetchById(this.id, {
			password: newPassword,
		});
	}
}

export default UserTempModel;