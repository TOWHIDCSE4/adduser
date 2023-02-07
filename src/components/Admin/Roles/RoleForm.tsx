import React from 'react'
import { Form, Input, Select } from 'antd';
import useBaseHook from '@src/hooks/BaseHook'
import tenantService from '@root/src/services/tenantService'
import useSWR from 'swr';
import auth from '@src/helpers/auth'
const { Option } = Select

const RoleGroupForm = () => {
  const { t, getData, router } = useBaseHook();
  const { query } = router
  const { data: dataT } = useSWR("selectTenants", () =>
  tenantService().withAuth().index({ pageSize: -1 })
);
  const tenants = getData(dataT, "data", [])

  return <>
    <Form.Item
      label={t("pages:roles.table.name")}
      name="name"
      rules={[
        { required: true, message: t('messages:form.required', { name: t('pages:roles.table.name') }) },
        { whitespace: true, message: t('messages:form.required', { name: t('pages:roles.table.name') }) },
        { max: 255, message: t('messages:form.maxLength', { name: t('pages:roles.table.name'), length: 255 }) }
      ]}
    >
      <Input placeholder={t("pages:roles.table.name")} />
    </Form.Item>
    <Form.Item
      label={t("pages:roles.table.description")}
      name="description"
      rules={[
        { max: 255, message: t('messages:form.maxLength', { name: t('pages:roles.table.description'), length: 255 }) }
      ]}
    >
      <Input placeholder={t("pages:roles.table.description")} />
    </Form.Item>
    {
      auth().user.permissions.root ? (<Form.Item
        label={t("pages:roles.form.tenant")}
        name="tenantId"
        rules={[
          { required: true, message: t('messages:form.required', {name: t('pages:roles.form.tenant')}) },
        ]}
      >
        <Select placeholder={t("pages:roles.form.tenant")} allowClear showSearch>
          {tenants.map((item: any) => (
            <Option value={item.id} key={item.id}>{item.name}</Option>
          ))}
        </Select>
      </Form.Item>):''
    }

  </>
}

export default RoleGroupForm
