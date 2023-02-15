import React from "react";
import { Form, Input, Row, Col, Select, Upload } from "antd";
import useBaseHook from "@src/hooks/BaseHook";
import validatorHook from "@src/hooks/ValidatorHook";
import { InboxOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import roleService from "@src/services/roleService";
import tenantService from "@src/services/tenantService";
import useSWR from "swr";
const { Search } = Input;
const { Option } = Select;
import auth from "@src/helpers/auth";
import _ from "lodash";
import UploadMultilField from "../../Upload";
import axios from "axios";
const { Dragger } = Upload;

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
	const handleFileChange = async (files) => {
		const info = files
	   form?.setFieldsValue({ 'avatar': info });
		console.log(info)
		// try {
		// 	const formData = new FormData();
			
		// 	formData.append("profileImg", info);
		// 	const res = await axios
		// 	  .post("http://localhost:3333/upload", formData, {}) //update to config
		// 	  .then((res) => {
		// 		return res.data.profileImg;
		// 	  });
	  
		// 	form?.setFieldsValue({ 'avatar': res });
		// 	console.log(res,form?.getFieldsValue());
		//   } catch (error: any) {
		// 	console.error(error.response?.data);
		//   }
	}
	

	return (
		<Row gutter={[24, 0]}>
		
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
			<Col md={12}>
				<Form.Item
					label={t("pages:users.form.avatar")}
					name="avatar"
					
				>
					<UploadMultilField listType="picture-card" isImg={true} onChange={handleFileChange}>
						<PlusOutlined />
					</UploadMultilField>
				</Form.Item>
				{/* <Form.Item
				label={t("pages:users.form.avatar")}
				name="avatar"
				>
					<Dragger
						multiple
						className="width-button"
					>
						<div>
						<p className="ant-upload-drag-icon">
						<PlusOutlined />
						</p>
						
						</div>
					</Dragger>
    			</Form.Item> */}
			</Col>
		</Row>
	);
};

export default UserInformationForm;