import React, { useEffect, useState } from "react";
import documentTemplateService from '@src/services/documentTemplateService';
import to from 'await-to-js'
import dynamic from "next/dynamic";
import { Button, Form, Col, Row, Input, Space, Select } from "antd";
import useBaseHook from "@src/hooks/BaseHook";
import FieldDefinition from "@root/src/components/Admin/documentTemplates/FieldDefinition";
import {
  SendOutlined,
} from "@ant-design/icons";
const Layout = dynamic(() => import("@src/layouts/Admin"), { ssr: false });

const languageTypes = [
  {
    label: "English",
    value: "en"
  },
  {
    label: "Vietnamese",
    value: "vi"
  }
]

const Create = () => {

  const [loading, setLoading] = useState(false);
  const { t, notify, redirect } = useBaseHook()
  const [form] = Form.useForm();
  let selectedRowKeys: string[] = [];
  let selectedActiveRowKeys: string[] = [];
  if (typeof window !== "undefined") {
    selectedRowKeys = localStorage.getItem("selectedRowKeys")
      ? localStorage.getItem("selectedRowKeys").split(",")
      : [];
    selectedActiveRowKeys = selectedRowKeys.splice(0, 5);
  }
  useEffect(() => {
    init();
  }, []);

  const init = async () => { };

  const submitForm = async (values: any) => {
    setLoading(true)
    if (!values || !values.createDocumentTemplates || (Array.isArray(values.createDocumentTemplates) && !values.createDocumentTemplates.length)) return
    
    for (let tem in values.createDocumentTemplates) {
      for (let validate in values.createDocumentTemplates[tem].validations) {
        switch (values.createDocumentTemplates[tem].validations[validate]) {
          case 'required' : case 'whitespace': {
            values.createDocumentTemplates[tem].validations[validate] = `{ required: true, message: t('messages:form.required', { name: ${values.createDocumentTemplates[tem].label} }) }`
          }
          break;
          case 'max': {
            values.createDocumentTemplates[tem].validations[validate] = `{ max: 255, message: t('messages:form.maxLength', { name: ${values.createDocumentTemplates[tem].label}, length: 255 }) }`
          }
          break;
        }
      }
    }

    let [error, result]: any[] = await to(documentTemplateService().withAuth().create(values));

    setLoading(false)

    if (error) return notify(t(`errors:${error.code}`), '', 'error')

    notify(t("messages:message.recordDocumentTemplatesCreated"))
    redirect("frontend.admin.application.index")
  };

  return (
    <div className="content">
      <Form
        form={form}
        onFinish={submitForm}
      >
        <Row gutter={[32, 0]}>
          <Col span={12}>
            <Form.Item
              labelAlign={"right"}
              name={["name"]}
              label={t("pages:documentTemplates.create.fieldInformation.templatesName")}
              rules={[
                { required: true, message: t('messages:form.required', { name: t("pages:documentTemplates.create.fieldInformation.templatesName") }) },
              ]}
            >
              <Input placeholder={t("pages:documentTemplates.create.fieldInformation.templatesName")} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              labelAlign={"right"}
              name={["locale"]}
              label={t("pages:documentTemplates.create.fieldInformation.language")}
              rules={[
                { required: true, message: t('messages:form.required', { name: t("pages:documentTemplates.create.fieldInformation.language") }) },
              ]}
            >
              <Select placeholder={t("pages:documentTemplates.create.fieldInformation.language")} style={{ width: "100%" }}>
                {
                  languageTypes.map((dataLang, index) =>
                    <Select.Option key={index} value={dataLang.value}>{dataLang.label}</Select.Option>
                  )}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <FieldDefinition formValue={form}/>
        <div style={{ textAlign: "center" }}>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SendOutlined />}
              loading={loading}
            >
              Submit
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  );
};

Create.Layout = (props) => {
  const { t } = useBaseHook();
  return (
    <Layout
      title={t("pages:documentTemplates.create.title")}
      description={t("pages:documentTemplates.create.description")}
      {...props}
    />
  );
};

Create.permissions = {
  "document_templates": "C",
};

export default Create;
