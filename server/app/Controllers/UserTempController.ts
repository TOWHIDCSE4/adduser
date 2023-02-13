import BaseController from "./BaseController";
import UserTempModel from "@root/server/app/Models/UserTempModel";
import RoleModel from "@app/Models/RoleModel";
import ApiException from "@app/Exceptions/ApiException";
import { removeVietnameseTones, hashNumber, makeKey } from "@helpers/utils";
import TenantsModel from "@app/Models/TenantsModel";
const speakeasy = require("speakeasy");
import Logger from "@core/Logger";
import redis from "../Services/Redis";
import Auth from "@root/server/libs/Auth";
const logger = Logger("UserTemp");
import authConfig from "@config/auth";
import MailService from "@root/server/app/Services/Mail";
import { NotFoundError } from "objection";
import UserModel from "../Models/UserModel";

export default class AdminController extends BaseController {
  Model: typeof UserTempModel = UserTempModel;
  RoleModel: any = RoleModel;
  TenantsModel: any = TenantsModel;

  async index() {
    const { auth } = this.request;
    let inputs = this.request.all();
    let project = [
      "user_temps.username",
      "user_temps.email",
      "user_temps.roleId",
      "user_temps.id",
      "tenants.name as tenantName",
      "roles.name as roleName",
      "user_temps.createdAt",
      "ag.username as agUsername",
    ];
    // let getAccountsItCreated = await this.Model.getAccountsItCreated(auth.id)
    // let tenantId = await this.Model.getTenantId(auth.id);
    // let getAccountsItCreatedId = getAccountsItCreated.map(item => item.id)

    let role = await this.RoleModel.getById(auth.roleId);
    let query = this.Model.query()
      .leftJoin("user_temps as ag", "user_temps.createdBy", "ag.id")
      .leftJoin("roles", "user_temps.roleId", "roles.id")
      .leftJoin("tenants", "user_temps.tenantId", "tenants.id")
      .whereNot("user_temps.id", auth.id);

    let result = await query.select(project).getForGridTable(inputs);
    return result;
  }

  async detail() {
    const { auth } = this.request;
    const allowFields = {
      id: "string!",
    };
    let inputs = this.request.all();
    let userTemp = await this.Model.query().where("id", auth.id).first();
    logger.info(`View Detail [usernameView:${userTemp.username}] `);
    let params = this.validate(inputs, allowFields, {
      removeNotAllow: true,
    });
    let result = await this.Model.getOne({ code: params.id });
    if (!result) {
      logger.error(`Critical:Show detail user ERR: user doesn't exist!`);
      throw new ApiException(6000, "user doesn't exist!");
    }
    logger.info(
      `Show detail user [usernameView:${
        userTemp.username
      },username:${JSON.stringify(result)}] `
    );
    return result;
  }

  makeUserTempLink(user) {
    let token = Auth.generateJWT(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      {
        key: authConfig["SECRET_KEY"],
        expiresIn: authConfig["JWT_EXPIRE_VERYFY_EMAIL"],
      }
    );
    redis.set(
      `UserTemp:${user.id}`,
      `${token}`,
      "EX",
      authConfig["JWT_EXPIRE_VERYFY_EMAIL"]
    );
    return `${this.request.get("origin")}/user-temp/${token}`;
  }

  async store() {
    const { auth } = this.request;
    let inputs = this.request.all();
    let userInfo = {
      ...inputs
    }

    let userTemp = await this.Model.query().where("id", auth.id).first();

    let usernameExist = await this.Model.findExist(inputs.username, "username");

    if (usernameExist) {
      logger.error(`Critical:User created ERR: Username already exists! `);
      throw new ApiException(6007, "Username already exists!");
    }

    let emailExist = await this.Model.findExist(inputs.email, "email");

    if (emailExist) {
      logger.error(`Critical:User created ERR: Email already exists! `);
      throw new ApiException(6021, "Email already exists!");
    }

    let role = await this.RoleModel.getById(inputs.roleId);
    if (!role) {
      logger.error(`Critical:User created ERR: User role not exists!`);
      throw new ApiException(6000, "User role not exists!");
    }

    if (inputs["password"])
      inputs["password"] = await this.Model.hash(inputs["password"]);

    let params = {
      ...inputs,
      createdBy: auth.id,
    };
    let result = await this.Model.insertOne(params);
    logger.info(
      `Create user [username:${userTemp.username},userCreated:${JSON.stringify(
        result
      )}] `
    );
    delete result["password"];

    //sent email
    let variables = {
      userTempLink: this.makeUserTempLink(result),
      email: result.email,
    };

    let subject = "KDDI — Create new user information";
    let content = `<div style="width: 100%;
      height: 300px;
      text-align: center;
      color: rgb(255, 255, 255);
      padding: 3px;
      font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #364574;
      ">
  <h1>Application-Platform</h1>
  <div style="
          max-width: 640px;
          height: 180px;
          text-align: center;
          background-color: #fff;
          border: solid 1px rgb(218, 218, 218);
          color: #364574;
          padding: 5px;
          margin: auto;">
    <h2>Create new user information</h2>
    <a href="${variables.userTempLink}" style="
                  text-align: center;
                  text-decoration: none;
                  display:inline-block;
                  padding: 14px 25px;
                  font-weight: bold;
                  background-color: #0AB39C;
                  color: #ffffff">
      Create new user information</a>
    <br />
    Welcome ${userInfo.username}, <br/> 
    your account has been created. Please enter your information in below link to active your account.
    After submitting successfully, please use your username and given password to login the system
    Your password: ${userInfo.password}
    *Important: Please change your password after login successfully  
<br/>
    Best regards
  </div>
</div>`;

    MailService.send(variables.email, subject, content, variables);

    return result;
  }

  async update() {
    let inputs = this.request.all();
    const { auth } = this.request;
    const allowFields = {
      id: "number!",
      email: "string!",
    };
    let userTemp = await this.Model.getById(auth.id);
    logger.info(`Update user [username:${userTemp.username}] `);
    let params = this.validate(inputs, allowFields, {
      removeNotAllow: true,
    });
    const { id } = params;
    delete params.id;

    let exist = await this.Model.getById(id);
    if (!exist) {
      logger.error(`Critical:User updated ERR: User doesn't exists!`);
      throw new ApiException(6006, "User doesn't exists!");
    }

    let emailExist = await this.Model.getOne({ email: params.email });
    if (emailExist && emailExist.id !== exist.id) {
      logger.error(`Critical:User updated ERR: Email already exists! `);
      throw new ApiException(6021, "Email already exists!");
    }

    let dataUpdate = {
      ...params,
    };

    let result = await this.Model.updateOne(id, { ...dataUpdate });
    logger.info(
      `Update user [username:${userTemp.username},userUpdate:${JSON.stringify(
        result
      )}] `
    );
    delete result["password"];
    return {
      result,
      old: exist,
    };
  }

  async updateUserInfo() {
    let data = this.request.all();
    let { token } = data;
    // // const allowFields = {
    // // 	firstName: "number!",
    // // 	lastName: "string!",
    // // };

    let user = await Auth.decodeJWT(token, {
      key: authConfig["SECRET_KEY"],
    });

    let userTemp = await this.Model.getById(user.id);

    console.log("userTemp", userTemp);

    if (!userTemp) {
      logger.error(`Critical:Show detail user ERR: user doesn't exist!`);
      throw new ApiException(6000, "user doesn't exist!");
    }

    let twofaKey = makeKey(32);

    do {
      twofaKey = makeKey(32);
    } while (!!(await UserModel.getOne({ twofaKey: twofaKey })));

    let params = {
      username: userTemp.username,
      password: userTemp.password,
      firstName: data.firstName,
      lastName: data.lastName,
      email: userTemp.email,
      birthday: data.date_of_birth,
      phone: data.phone,
      twofa: 1,
      twofaKey: twofaKey,
      isFirst: 1,
      roleId: userTemp.roleId,
      tenantId: userTemp.tenantId,
    };

    let result = await UserModel.insertOne(params);
    logger.info(
      `Create user [username:${user.username},userCreted:${JSON.stringify(
        result
      )}] `
    );
    let code = hashNumber(String(result.id));
    let resultUpdate = await UserModel.updateOne(result.id, { code: code });

    console.log("userTemp", userTemp);
    console.log("user", user);

    delete resultUpdate["password"];
    delete resultUpdate["twofaKey"];
    delete resultUpdate["isFirst"];
    delete resultUpdate["twofa"];
    return resultUpdate;
  }

  async destroy() {
    const { auth } = this.request;
    let params = this.request.all();
    let id = params.id;
    if (!id) throw new ApiException(9996, "ID is required!");

    let exist = await this.Model.getById(id);
    if (!exist) {
      logger.error(`Critical:User destroy ERR: User doesn't exists!`);
      throw new ApiException(6006, "User doesn't exists!");
    }
    if ([id].includes(auth.id))
      throw new ApiException(6022, "You can not remove your account.");

    let user = await this.Model.query().where("id", params.id).first();
    await user.$query().delete();
    let userAuth = await this.Model.getById(auth.id);
    logger.info(
      `Destroy user [username:${userAuth.username},userDelete:${JSON.stringify(
        user
      )}] `
    );
    return {
      message: `Delete successfully`,
      old: user,
    };
  }

  async delete() {
    const { auth } = this.request;
    const allowFields = {
      ids: ["number!"],
    };
    const inputs = this.request.all();
    let params = this.validate(inputs, allowFields);

    let exist = await this.Model.query().whereIn("id", params.ids);
    if (!exist || exist.length !== params.ids.length) {
      logger.error(`Critical:User delete ERR: User doesn't exists!`);
      throw new ApiException(6006, "User doesn't exists!");
    }
    if (params.ids.includes(auth.id)) {
      logger.error(
        `Critical:User delete ERR: You can not remove your account!`
      );
      throw new ApiException(6022, "You can not remove your account.");
    }

    let users = await this.Model.query().whereIn("id", params.ids);
    for (let user of users) {
      await user.$query().delete();
    }
    let userAuth = await this.Model.getById(auth.id);
    logger.info(
      `Delete user [username:${
        userAuth.username
      },listUserDelete:${JSON.stringify(users)}] `
    );
    return {
      old: {
        usernames: (users || []).map((user) => user.username).join(", "),
      },
    };
  }
}
