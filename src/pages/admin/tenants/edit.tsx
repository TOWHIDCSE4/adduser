import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic';
import { Button, Form, Spin,Card } from 'antd';
import tenantService from '@src/services/tenantService';
import { confirmDialog } from '@src/helpers/dialogs'
import to from 'await-to-js'
import useBaseHook from '@src/hooks/BaseHook'
import { LeftCircleFilled, SaveFilled, DeleteFilled } from '@ant-design/icons';
import usePermissionHook from "@src/hooks/PermissionHook";
import TenantsForm from '@src/components/Admin/Tenants/TenantsForm';
import UserForm from '@src/components/Admin/Users/UserForm';

const Layout = dynamic(() => import('@src/layouts/Admin'), { ssr: false })

const Edit = () => {
  const { t, notify, redirect, router } = useBaseHook();
  const [loading, setLoading] = useState(false);
  const [tenant, setTenant]: any[] = useState();
  const [form] = Form.useForm();
  const { checkPermission } = usePermissionHook();
  const { query } = router

  const deletePer = checkPermission({
    "tenants": "D"
  })

  const updatePer = checkPermission({
    "tenants": "U"
  })

  const fetchData = async () => {
    let idError: any = null;

    if (!query.id) {
      idError = {
        code: 9996,
        message: 'missing ID'
      }
    }
    if (idError) return notify(t(`errors:${idError.code}`), '', 'error')
    let [tenantError, tenant]: [any, Tenant] = await to(tenantService().withAuth().detail({ id: query.id }));
    if (tenantError) return notify(t(`errors:${tenantError.code}`), '', 'error')

    setTenant(tenant)
  }

  useEffect(() => {
    fetchData()
  }, []);

  //submit form
  const onFinish = async (values: any): Promise<void> => {
    setLoading(true)
    let [error, result]: any[] = await to(tenantService().withAuth().edit({
      id: tenant.id,
      ...values
    }));

    setLoading(false)

    if (error) return notify(t(`errors:${error.code}`), '', 'error')

    notify(t("messages:message.recordTenantsUpdated"))
    redirect("frontend.admin.tenants.index")

    return result
  }

  const onDelete = async (): Promise<void> => {
    let [error, result]: any[] = await to(tenantService().withAuth().destroy({ id: tenant.code }));
    if (error) return notify(t(`errors:${error.code}`), '', 'error')

    notify(t('messages:message.recordRoleDeleted'))
    redirect("frontend.admin.tenants.index")

    return result
  }

  if (!tenant) return <div className="content"><Spin /></div>

  return (
    <div className="content">
      <Form
        form={form}
        name="editTenants"
        layout="vertical"
        initialValues={{
          ...tenant,
          ...tenant.others
        }}
        onFinish={onFinish}
        scrollToFirstError
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
          <Button hidden={!updatePer} type="primary" htmlType="submit" className="btn-margin-right" loading={loading}>
            <SaveFilled /> {t('buttons:submit')}
          </Button>
          <Button hidden={!deletePer || tenant.id ==  1} danger
            onClick={() => {
              confirmDialog({
                title: t('buttons:deleteItem'),
                content: t('messages:message.deleteConfirm'),
                onOk: () => onDelete()
              })
            }}
          >
            <DeleteFilled /> {t('buttons:deleteItem')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

Edit.Layout = (props) => {
  const { t } = useBaseHook();

  return <Layout
    title={t("pages:tenants.edit.title")}
    description={t("pages:tenants.edit.description")}
    {...props}
  />
}

Edit.permissions = {
  "tenants": "R"
}

export default Edit