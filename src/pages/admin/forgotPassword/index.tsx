import { useState } from 'react'
import Layout from '@src/layouts/Login'
import { LeftCircleFilled, MailOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Form, Input, Row, Col, Tag } from 'antd'
import authService from '@src/services/authService'
import to from 'await-to-js'
import useBaseHook from '@src/hooks/BaseHook';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig()

const Index = () => {
  const { t, redirect, notify, router } = useBaseHook()
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const onFinish = async (values: any) => {
    setLoading(true)
    let [error, result]: any[] = await to(authService().forgotPassword({ data: values }))
    setLoading(false)
    if (error) return notify(t(`errors:${error.code}`), '', 'error')
    notify(t('messages:message.forgotPasswordSuccess'))
    redirect('frontend.admin.login')
    return result
  }

  return <>
    <div className="content-form">
      <div className="logo">
        <div className="img">
          <img src={publicRuntimeConfig.LOGO}></img>
        </div>
        <div className="sitename">{t('pages:forgotPassword.content')}</div>
      </div>
      <div className='form-login'>
        <div className="content-form-login">
          <div className="sitename-title">Forgot Password?</div>
          <div className="sitename">Reset password with KDDI</div>
          <div className="email"></div>
          <Tag color="warning">Enter your email and instructions will be sent to you!</Tag>
        </div>
        <Form
          onFinish={onFinish}
          form={form}
          name="forgotPasswordForm"
          layout="horizontal"
          initialValues={{
            email: ""
          }}
        >
          <Col md={24} sm={24} xs={24}>
            <div style={{ marginBottom: 5, fontWeight: 600 }}>Email</div>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: t('messages:form.required', { name: t('pages:forgotPassword.email') }) },
                { type: 'email', message: t('messages:form.email') },
                { max: 255, message: t('messages:form.maxLength', { name: t('pages:forgotPassword.email'), length: 255 }) }
              ]}
            >
              <Input
                placeholder={"Enter " + t('pages:forgotPassword.email')}
                type="email"
                prefix={<MailOutlined />}
              />
            </Form.Item>
          </Col>
          <Col md={24} sm={24} xs={24}>
            <Form.Item>
              <Row gutter={12}>
                <Col md={24} sm={24} xs={24}>
                  <Button className="btn login" type="primary" htmlType="submit" loading={loading}>
                    <SendOutlined />
                    {'Send Reset Link'}
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </Col>
        </Form>
        <div style={{ textAlign: 'center', paddingTop: 20 }}>
          Wait, I remember my password...
          <a
            onClick={() => router.back()}
            style={{ color: "#405189" }}
          >
            Click here
          </a>
        </div>
      </div>
    </div>
  </>
}

Index.Layout = (props) => {
  const { t } = useBaseHook();
  return <Layout
    title={t('pages:forgotPassword.title')}
    description={t('pages:forgotPassword.description')}
    {...props}
  />
}

export default Index
