import React from "react";
import { Form, Input, Row, Col, Select, Button } from "antd";
import useBaseHook from "@src/hooks/BaseHook";
import validatorHook from "@src/hooks/ValidatorHook";
import { LockOutlined, SyncOutlined } from "@ant-design/icons";
import roleService from "@src/services/roleService";
import tenantService from "@src/services/tenantService";
import useSWR from "swr";
const { Search } = Input;
const { Option } = Select;
import auth from "@src/helpers/auth";
import _ from "lodash";

const UserInformationForm = ({
	form,
	isEdit,
	isTenant = false,
}: {
	form: any;
	isEdit: boolean;
	isTenant?: boolean;
}) => {
	const { t, getData } = useBaseHook();
	// const { validatorRePassword, CustomRegex } = validatorHook();
	// const { data: dataT } = useSWR("groupSelect2", () =>
	// 	roleService().withAuth().select2({ pageSize: -1 })
	// );
	// const { data: dataC } = useSWR("tenants", () =>
	// 	tenantService().withAuth().index({ pageSize: -1 })
	// );
	// let tenant = _.get(dataC, "data", []);
	// const randompass = () => {
	// 	let result = "";
	// 	let characters =
	// 		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	// 	let charactersLength = characters.length;
	// 	for (let i = 0; i < 8; i++) {
	// 		result += characters.charAt(
	// 			Math.floor(Math.random() * charactersLength)
	// 		);
	// 	}
	// 	form.setFieldsValue({ password: result });
	// };

	// const roles = getData(dataT, "data", []);

	return (
		<Row gutter={[24, 0]}>
			{/* <Col md={24}>
				<Form.Item
					label={t("pages:users.form.username")}
					name="username"
					rules={[
						{
							required: true,
							message: t("messages:form.required", {
								name: t("pages:users.form.username"),
							}),
						},
						{
							whitespace: true,
							message: t("messages:form.required", {
								name: t("pages:users.form.username"),
							}),
						},
						CustomRegex({
							length: 6,
							reGex: "^[0-9A-z._](\\w|\\.|_){5,100}$",
							message: t("messages:form.username"),
						}),
					]}
				>
					<Input
						placeholder={t("pages:users.form.username")}
						readOnly={isEdit}
					/>
				</Form.Item>
			</Col> */}

			{/* <Col md={2}>
        <Form.Item
          label={t("pages:users.form.twofa")}
          name="twofa"
          valuePropName="checked"
          rules={[
            { required: true, message: t('messages:form.required', { name: t('pages:users.form.twofa') }) },
          ]}
        >
          <Switch />
        </Form.Item>
      </Col> */}
			{!isEdit ? (
				<>
					{/* <Col md={24}>
						<Form.Item
							label={t("pages:users.form.password")}
							name="password"
							rules={[
								{
									required: true,
									message: t("messages:form.required", {
										name: t("pages:users.form.password"),
									}),
								},
							]}
						>
							<Input
								placeholder={t("pages:users.form.password")}
								autoComplete="off"
								addonBefore={
									<div
										style={{ width: " 100%" }}
										onClick={() => randompass()}
									>
										<SyncOutlined />
									</div>
								}
								disabled
							/>
						</Form.Item>
					</Col> */}
					{/* <Col md={12}>
            <Form.Item
              label={t("pages:users.form.rePassword")}
              name="rePassword"
              rules={[
                { required: true, message: t("messages:form.required", { name: t("pages:users.form.rePassword") }) },
                validatorRePassword({
                  key: "password",
                  message: t("messages:form.rePassword"),
                  getFieldValue: form.getFieldValue,
                }),
              ]}
            >
              <Input.Password
                placeholder={t("pages:users.form.rePassword")}
                prefix={<LockOutlined />}
                autoComplete="off"
              />
            </Form.Item>
          </Col> */}
				</>
			) : null}
			<Col md={12}>
				<Form.Item
					label={t("pages:users.form.lastName")}
					name="lastName"
					rules={[
						{
							required: true,
							message: t("messages:form.required", {
								name: t("pages:users.form.lastName"),
							}),
						},
						{
							whitespace: true,
							message: t("messages:form.required", {
								name: t("pages:users.form.lastName"),
							}),
						},
						{
							max: 255,
							message: t("messages:form.maxLength", {
								name: t("pages:users.form.lastName"),
								length: 255,
							}),
						},
					]}
				>
					<Input placeholder={t("pages:users.form.lastName")} />
				</Form.Item>
			</Col>

			<Col md={12}>
				<Form.Item
					label={t("pages:users.form.firstName")}
					name="firstName"
					rules={[
						{
							required: true,
							message: t("messages:form.required", {
								name: t("pages:users.form.firstName"),
							}),
						},
						{
							whitespace: true,
							message: t("messages:form.required", {
								name: t("pages:users.form.firstName"),
							}),
						},
						{
							max: 255,
							message: t("messages:form.maxLength", {
								name: t("pages:users.form.firstName"),
								length: 255,
							}),
						},
					]}
				>
					<Input placeholder={t("pages:users.form.firstName")} />
				</Form.Item>
			</Col>

			<Col md={12}>
				<Form.Item
					label={t("pages:users.form.phone")}
					name="phone"
					rules={[
						{
							required: true,
							message: t("messages:form.required", {
								name: t("pages:users.form.phone"),
							}),
						},
						{
							whitespace: true,
							message: t("messages:form.required", {
								name: t("pages:users.form.phone"),
							}),
						},
						{
							max: 255,
							message: t("messages:form.maxLength", {
								name: t("pages:users.form.phone"),
								length: 255,
							}),
						},
					]}
				>
					<Input placeholder={t("pages:users.form.phone")} />
				</Form.Item>
			</Col>

			<Col md={12}>
				<Form.Item
					label={t("pages:users.form.date_of_birth")}
					name="date_of_birth"
					rules={[
						{
							required: true,
							message: t("messages:form.required", {
								name: t("pages:users.form.date_of_birth"),
							}),
						},
						{
							whitespace: true,
							message: t("messages:form.required", {
								name: t("pages:users.form.date_of_birth"),
							}),
						},
						{
							max: 255,
							message: t("messages:form.maxLength", {
								name: t("pages:users.form.date_of_birth"),
								length: 255,
							}),
						},
					]}
				>
					<Input type="date" placeholder={t("pages:users.form.date_of_birth")} />
				</Form.Item>
			</Col>

			{/* <Col md={24}>
				<Form.Item
					label={t("pages:users.form.email")}
					name="email"
					rules={[
						{
							required: true,
							message: t("messages:form.required", {
								name: t("pages:users.form.email"),
							}),
						},
						{ type: "email", message: t("messages:form.email") },
						{
							max: 100,
							message: t("messages:form.maxLength", {
								name: t("pages:users.form.email"),
								length: 100,
							}),
						},
					]}
				>
					<Input
						placeholder={t("pages:users.form.email")}
						type="email"
					/>
				</Form.Item>
			</Col> */}
			{/* {!isEdit && !isTenant ? (
				<>
					<Col md={24}>
						<Form.Item
							label={t("pages:users.form.role")}
							name="roleId"
							rules={[
								{
									required: true,
									message: t("messages:form.required", {
										name: t("pages:users.form.role"),
									}),
								},
							]}
						>
							<Select
								placeholder={t("pages:users.form.role")}
								allowClear
								showSearch
							>
								{roles.map((item: any) => (
									<Option value={item.value} key={item.value}>
										{item.label}
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>
				</>
			) : null} */}

			{/* {auth().user.permissions.root && !isTenant ? (
				<Col md={24}>
					<Form.Item
						label={t("pages:users.form.tenant")}
						name="tenantId"
						rules={[
							{
								required: true,
								message: t("messages:form.required", {
									name: t("pages:users.form.tenant"),
								}),
							},
						]}
					>
						<Select
							placeholder={t("pages:users.form.tenant")}
							allowClear
							showSearch
						>
							{tenant.map((item: any) => (
								<Option value={item.id} key={item.name}>
									{item.name}
								</Option>
							))}
						</Select>
					</Form.Item>
				</Col>
			) : (
				""
			)} */}
		</Row>
	);
};

export default UserInformationForm;