import React, { useState } from 'react'
import dynamic from 'next/dynamic';
import { Button, Form,Card,Row,Col } from 'antd';
import tenantService from '@src/services/tenantService';
import to from 'await-to-js'
import useBaseHook from '@src/hooks/BaseHook'
import { LeftCircleFilled, SaveFilled } from '@ant-design/icons';
import TenantsForm from '@src/components/Admin/Tenants/TenantsForm';
import UserForm from '@src/components/Admin/Users/UserForm';

const Layout = dynamic(() => import('@src/layouts/Admin'), { ssr: false })

const Create = () => {
  const { t, notify, redirect, router } = useBaseHook();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  //submit form
  const onFinish = async (values: any): Promise<void> => {
    setLoading(true)
    let { rePassword, ...otherValues } = values;
    let [error, result]: any[] = await to(tenantService().withAuth().create(otherValues));
    setLoading(false)
    if (error) return notify(t(`errors:${error.code}`), '', 'error')
    notify(t("messages:message.recordTenantsCreated"))
    redirect("frontend.admin.tenants.index")
  }

  return (
    <div className="content">
      <Form
        form={form}
        name="createTenants"
        initialValues={{}}
        onFinish={onFinish}
        scrollToFirstError        
        layout="vertical"
      >
        <TenantsForm />        
        <br/>
        <Card title="User Admin of Tenants">
            <UserForm form={form} isEdit={false} isTenant={true} />
        </Card>
        <br/>
        <Form.Item wrapperCol={{ span: 24 }} className="text-center">
          <Button onClick={() => router.back()} className="btn-margin-right">
            <LeftCircleFilled /> {t('buttons:back')}
          </Button>
          <Button type="primary" htmlType="submit" loading={loading} className="btn-margin-right">
            <SaveFilled /> {t('buttons:submit')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

Create.Layout = (props) => {
  const { t } = useBaseHook();

  return <Layout
    title={t("pages:tenants.create.title")}
    description={t("pages:tenants.create.description")}
    {...props}
  />
}

Create.permissions = {
  "tenants": "C"
}

export default Create