import React from 'react'
import { Form, Input, Select, Card, Row, Col } from 'antd';
import useBaseHook from '@src/hooks/BaseHook'
// import roleGroup from '@root/src/services/tenantservice'
import useSWR from 'swr';

const { Option } = Select

const TenantsForm = () => {
  const { t, getData, router } = useBaseHook();
  const { query } = router
  // const { data } = useSWR('selectParent', () => roleGroup().withAuth().select2({id:query.id,pageSize: -1}))
  // const tenants = getData(data, "data", [])

  return <Card title="Tenants">
    <Row gutter={[24, 0]}>
      <Col span={12}>
        <Form.Item
          label={t("pages:tenants.table.name")}
          name="name"
          rules={[
            { required: true, message: t('messages:form.required', { name: t('pages:tenants.table.name') }) },
            { whitespace: true, message: t('messages:form.required', { name: t('pages:tenants.table.name') }) },
            { max: 255, message: t('messages:form.maxLength', { name: t('pages:tenants.table.name'), length: 255 }) }
          ]}
        >
          <Input placeholder={t("pages:tenants.table.name")} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label={t("pages:tenants.form.email")}
          name="emailTenant"
          rules={[
            { type: 'email', message: t('messages:form.email') },
            { max: 100, message: t('messages:form.maxLength', { name: t('pages:tenants.form.email'), length: 100 }) }
          ]}
        >
          <Input
            placeholder={t('pages:tenants.form.email')}
            type="email"
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label={t("pages:tenants.table.phone")}
          name="phone"
          rules={[
            { max: 255, message: t('messages:form.maxLength', { name: t('pages:tenants.table.phone'), length: 255 }) }
          ]}
        >
          <Input placeholder={t("pages:tenants.table.phone")} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label={t("pages:tenants.table.address")}
          name="address"
          rules={[
            { max: 255, message: t('messages:form.maxLength', { name: t('pages:tenants.table.address'), length: 255 }) }
          ]}
        >
          <Input placeholder={t("pages:tenants.table.address")} />
        </Form.Item>
      </Col>
    </Row>
  </Card>
}

export default TenantsForm
