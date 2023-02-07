import React from "react";
import { Modal, Form, Input } from "antd";
import { LockOutlined } from '@ant-design/icons';
import useBaseHook from "@src/hooks/BaseHook";
interface ModelFormProps {
  onChangePassword: any;
  onCancel: () => void;
  visible: boolean;
}

const ChangePassword = ({ onChangePassword, visible, onCancel }: ModelFormProps) => {
  const { t } = useBaseHook();
  const [form] = Form.useForm();

  //validate input password
  const validatorPassword = ({ getFieldValue }: {
    getFieldValue: Function;
  }) => ({
    validator: (rule: any, value: any) => {
      if (!value || getFieldValue("password") === value) return Promise.resolve();
      return Promise.reject(t("messages:form.rePassword"));
    }
  });

  return (
    <Form
      form={form}
      name="formChangePassword"
      initialValues={{
        password: "",
        repassword: ""
      }}
      onFinish={onChangePassword}
    >
      <Modal
        closable={false}
        visible={visible}
        title={t("pages:changePassword.title")}
        onCancel={onCancel}
        onOk={() => { form.submit() }}
      >
        <Form.Item
          label={t("pages:changePassword.password")}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          name="password"
          rules={[
            { required: true, message: t("messages:form.required", { name: t("pages:changePassword.password") }) }
          ]}
        >
          <Input.Password
            placeholder={t("pages:changePassword.password")}
            type="password"
            prefix={<LockOutlined />}
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item
          label={t("pages:changePassword.rePassword")}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          name="repassword"
          rules={[
            { required: true, message: t("messages:form.required", { name: t("pages:changePassword.rePassword") }) },
            validatorPassword
          ]}
        >
          <Input.Password
            type="password"
            autoComplete="off"
            prefix={<LockOutlined />}
            placeholder={t("pages:changePassword.rePassword")}
          />
        </Form.Item>
      </Modal>
    </Form>
  );
};

export default ChangePassword;
