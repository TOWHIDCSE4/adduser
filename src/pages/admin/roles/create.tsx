import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { Button, Form,Card } from 'antd';
import roleService from '@src/services/roleService';
import to from 'await-to-js'
import useBaseHook from '@src/hooks/BaseHook'
import { LeftCircleFilled, SaveFilled } from '@ant-design/icons';
import RoleForm from '@src/components/Admin/Roles/RoleForm';
import PermistionForm from '@src/components/Admin/Roles/PermistionForm';
import permissionService from "@src/services/permissionService";

const Layout = dynamic(() => import('@src/layouts/Admin'), { ssr: false })

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

const Create = () => {
  const { t, notify, redirect, router } = useBaseHook();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [state, setState] = useState({
    permissions: [],
  });
  const fetchData = async () => {
    let [permissionError, permissions]: any[] = await to(
      permissionService().withAuth().getPermissionByTenantId()
    );
    if (permissionError)
      return notify(t(`errors:${permissionError.code}`), "", "error");
    setState({
      ...state,
      permissions: permissions,
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  //submit form
  const onFinish = async (values: any): Promise<void> => {
    const [errorField, valuesField] = await to(form.validateFields());
    if (errorField) {
      return;
    }
    setLoading(true)
    let dataCreated = {
      ...valuesField,
      permissions: values
    }
    let [error, result]: any[] = await to(roleService().withAuth().create(dataCreated));

    setLoading(false)

    if (error) return notify(t(`errors:${error.code}`), '', 'error')

    notify(t("messages:message.recordRoleCreated"))
    redirect("frontend.admin.roles.index")
  }

  return (
    <div className="content">
      <Card title="Role Create">
      <Form
        {...formItemLayout}
        form={form}
        name="createRole"
        initialValues={{}}
        scrollToFirstError
      >
        <RoleForm />
      </Form>
      </Card>
      <br/>
      <PermistionForm onFinish={onFinish} dataPer={state} loading={loading}/>
    </div>
  )
}

Create.Layout = (props) => {
  const { t } = useBaseHook();

  return <Layout
    title={t("pages:roles.create.title")}
    description={t("pages:roles.create.description")}
    {...props}
  />
}

Create.permissions = {
  "roles": "C"
}

export default Create