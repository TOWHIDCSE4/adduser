import Route from '@core/Routes'
const ExtendMiddleware = require("@app/Middlewares/ExtendMiddleware");
const AuthApiMiddleware = require('@app/Middlewares/AuthApiMiddleware');
const multer = require('multer')
import  PermissionMiddleware  from "@app/Middlewares/PermissionMiddleware"
import { v4 as uuidv4 } from "uuid";
const fs = require('fs')
const path = require('path')
const express = require('express')
const app = express()
const { permission, permissionResource, permissionMethod } = PermissionMiddleware

const storage = multer.diskStorage({
  destination: function (req,file,cb) {
    cb(null, path.join(__dirname,'/public/uploads'))
  },
  filename: function(req,file,cb) {
    cb(null,file.fieldname+"-"+Date.now()+path.extname(file.originalname))
  }
})
const upload = multer({storage:storage})
const fileUpload = upload.fields([{name:'image-file', maxCount: 1}])


Route.group(() => {
  // ---------------------------------- Auth Routes ---------------------------------------//
  Route.post("/login", "AuthController.login").name('auth.login')
  Route.post("/forgotPassword", "AuthController.forgotPassword").name('auth.forgotPassword')
  Route.get("/checkToken/:token", "AuthController.checkToken").name('auth.checkToken')
  Route.post("/resetPassword", "AuthController.resetPassword").name('auth.resetPassword')

  // ---------------------------------- End Auth Routes -----------------------------------//

  // ---------------------------------- Route Routes ---------------------------------------//
  Route.get("/routes", "RouteController.index").name('routes.index')
  // ---------------------------------- End Route Routes -----------------------------------//

  // ---------------------------------- Route Document Routes ---------------------------------------//
  Route.resource("/documents", "DocumentController").name('documents')
  // ---------------------------------- End Route Document Routes -----------------------------------//

  // ---------------------------------- Route DocumentTemplate Routes ---------------------------------------//
  Route.resource("/document_templates", "DocumentTemplateController").name('document_templates')
  // Route.group(() => {

  // })
  // ---------------------------------- End Route Document Routes -----------------------------------//
  Route.post('/register', "UserTempController.createUserFromLink").name('register.user').middleware([upload.any(), permission({ 'documents': 'C' })]);
  Route.get("/verifyToken/:token", "UserTempController.verifyToken").name('usertemp.verifyToken')

  Route.group(() => {
		Route.post("/changePassword", "AuthController.changePassword").name(
			"auth.changePassword"
		);
		Route.post("/logout", "AuthController.logout").name("auth.logout");
		Route.post(
			"/auth/getPermissionBot",
			"AuthController.getPermissionBot"
		).name("auth.getPermissionBot");
		Route.post("/refreshToken", "AuthController.refreshToken").name(
			"auth.refreshToken"
		);
		Route.post(
			"/auth/getRoleBotUser",
			"AuthController.getRoleBotUser"
		).name("auth.getRoleBotUser");
		Route.post("/AuthTwofa", "AuthController.AuthTwofa").name(
			"auth.AuthTwofa"
		);
		Route.post("/changeState2FA", "AuthController.changeState2FA").name(
			"auth.changeState2FA"
		);

		// ---------------------------------- User Routes ---------------------------------------//
		Route.resource("/users", "UserController")
			.name("users")
			.middleware([permissionResource(["users"])]); // CRUD
		Route.get("/users/generateOTP", "UserController.generateOTP")
			.name("users.generateOTP")
			.middleware([permission({ users: "R" })]);
		Route.post("/users/submitOTP", "UserController.submitOTP").name(
			"users.submitOTP"
		);
		Route.get("/users/getInfo", "UserController.getInfo")
			.name("users.getInfo")
			.middleware([permission({ users: "R" })]);
		// ---------------------------------- End User Routes -----------------------------------//

		// ---------------------------------- User Temp Routes -----------------------------------//
		Route.resource("/userTemps", "UserTempController")
			.name("userTemps")
			.middleware([permissionResource(["users"])]); // CRUD

		// ---------------------------------- End User Routes -----------------------------------//

		// ---------------------------------- Role Permission Routes ---------------------------------------//
		Route.get(
			"/rolePermissions/getPermissionByTenantId",
			"RolePermissionController.getPermissionByTenantId"
		)
			.name("rolePermissions.getPermissionByTenantId")
			.middleware([permission({ roles: "R" })]);

		Route.get(
			"/rolePermissions/getPermissionByGroupId",
			"RolePermissionController.getPermissionByGroupId"
		)
			.name("rolePermissions.getPermissionByGroupId")
			.middleware([permission({ roles: "R" })]);
		// ---------------------------------- End Role Permission Routes -----------------------------------//

		// ---------------------------------- Role Group Permission Routes ---------------------------------//
		Route.put("/rolePermissions/update", "RolePermissionController.update")
			.name("rolePermissions.update")
			.middleware([permission({ adminDecentralization: "U" })]);
		// ---------------------------------- End Role Group Permission Routes -----------------------------//

		// ---------------------------------- Role Group Routes ---------------------------------------//
		Route.resource("/roles", "RoleController")
			.name("roles")
			.middleware([permissionResource(["roles"])]);
		Route.get("/roles/select2", "RoleController.select2")
			.name("roles.select2")
			.middleware([permission({ roles: "R" })]);
		// Route.get("/roles/selectParent", "RoleController.selectParent").name('roles.selectParent')
		// ---------------------------------- End Role Group Routes -----------------------------------//

		// ---------------------------------- Setting Routes ---------------------------------------//

		Route.resource("/settings", "SettingController").name("settings");

		// ---------------------------------- tenants Routes ---------------------------------------//

		Route.post("/tenants/active", "TenantController.activeTenants")
			.name("tenants.activeTenants")
			.middleware([permission({ tenants: "A" })]);
		Route.resource("/tenants", "TenantController")
			.name("tenants")
			.middleware([permissionResource(["tenants"])]);

		// ---------------------------------- End tenants Routes -----------------------------------//

		// ---------------------------------- End Routes -----------------------------------//
  }).middleware([AuthApiMiddleware])
}).middleware([ExtendMiddleware]).name('api').prefix("/api/v1")