import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic';
import { Button, Form, Col, Row, Spin } from 'antd';
import userService from '@root/src/services/userService';
import { confirmDialog } from '@src/helpers/dialogs'
import to from 'await-to-js'
import useBaseHook from '@src/hooks/BaseHook'
import { LeftCircleFilled, SaveFilled, DeleteFilled } from '@ant-design/icons';
import usePermissionHook from "@src/hooks/PermissionHook";
import UserForm from '@src/components/Admin/Users/UserForm';
import auth from '@src/helpers/auth'

const Layout = dynamic(() => import('@src/layouts/Admin'), { ssr: false })

const Edit = () => {
  const { t, notify, redirect, router } = useBaseHook();
  const [loading, setLoading] = useState(false);
  const [admin, setAdmin]: any[] = useState<User>();
  const [form] = Form.useForm();
  const { checkPermission } = usePermissionHook();
  const { query } = router
  const deletePer = checkPermission({
    "users": "D"
  }) && auth().user.id != query.id

  const updatePer = checkPermission({
    "users": "U"
  })


  const fetchData = async() => {
    let idError: any = null;
    if (!query.id) {
      idError = {
        code: 9996,
        message: 'missing ID'
      }
    }
    if(idError) return notify(t(`errors:${idError.code}`), '', 'error')
    let [adminError, admin]: [any, User] = await to(userService().withAuth().detail({ id: query.id }));
    admin.twofa = admin.twofa ? true : false
    if(adminError) return notify(t(`errors:${adminError.code}`), '', 'error')
    console.log("admin", admin)
    setAdmin(admin)
  }

  useEffect(() => {
    fetchData()
  }, []);

  //submit form
  const onFinish = async (values: any): Promise<void> => {
    setLoading(true)
    if(updatePer){
      let [error, result]: any[] = await to(userService().withAuth().edit({
        id: admin.id,
        ...values
      }));
      setLoading(false)
      if (error) return notify(t(`errors:${error.code}`), '', 'error')
      notify(t("messages:message.recordUserUpdated"))
      redirect("frontend.admin.users.index")
      return result
    }
  }

  const onDelete = async (): Promise<void> => {
    let [error, result]: any[] = await to(userService().withAuth().destroy({id: admin.id}));
    if (error) return notify(t(`errors:${error.code}`), '', 'error')
    notify(t('messages:message.recordUserDeleted'))
    redirect("frontend.admin.users.index")
    return result
  }

  if(!admin) return <div className="content"><Spin /></div>
  return <>
    <div className="content">
      <Form
        form={form}
        layout="vertical"
        name="editAdmin"
        initialValues={{
          firstName: admin.firstName,
          lastName: admin.lastName,
          username: admin.username,
          email: admin.email,
          tenantId: admin.tenantId
        }}
        onFinish={onFinish}
        scrollToFirstError
      >
        <Row>
          <Col md={{span: 16, offset: 4}}>
            <UserForm form={form} isEdit={true} />
            <Form.Item wrapperCol={{ span: 24 }} className="text-center">
              <Button onClick={() => router.back()} className="btn-margin-right">
                <LeftCircleFilled /> {t('buttons:back')}
              </Button>
              <Button hidden={!updatePer} type="primary" htmlType="submit" className="btn-margin-right" loading={loading}>
                <SaveFilled /> {t('buttons:submit')}
              </Button>
              <Button hidden={!deletePer} danger
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
          </Col>
        </Row>
      </Form>
    </div>
  </>
}

Edit.Layout = (props) => {
  const { t } = useBaseHook();
  return <Layout
    title={t("pages:users.edit.title")}
    description={t("pages:users.edit.description")}
    {...props}
  />
}

Edit.permissions = {
  "users": "R"
}

export default Edit
