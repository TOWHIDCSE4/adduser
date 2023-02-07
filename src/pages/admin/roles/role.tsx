import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic';
import { Button, Checkbox, Table, Spin } from 'antd';
import permissionService from '@src/services/permissionService';
import rolePermissionService from '@src/services/rolePermissionService';
import to from 'await-to-js'
import useBaseHook from '@src/hooks/BaseHook'
import { LeftCircleFilled, SaveFilled } from '@ant-design/icons';
import usePermissionHook from "@src/hooks/PermissionHook";
const Layout = dynamic(() => import('@src/layouts/Admin'), { ssr: false })

const Role = () => {
  let result: any = {}
  const { t, notify, redirect, router } = useBaseHook();
  const { checkPermission } = usePermissionHook();
  const [loading, setLoading] = useState(false);
  const { query } = router
  const { id: roleCode } = query
  const [state, setState] = useState({
    permissions: []
  });

  const updatePer = checkPermission({
    "adminDecentralization": "U"
  })
  const fetchData = async () => {
    let idError: any = null;

    if (!roleCode) {
      idError = {
        code: 9996,
        message: 'missing ID'
      }
    }
    if (idError) return notify(t(`errors:${idError.code}`), '', 'error')

    let [permissionError, permissions]: any[] = await to(permissionService().withAuth().getPermissionByRoleCode({ roleCode: roleCode}));
    if (permissionError) return notify(t(`errors:${permissionError.code}`), '', 'error')
    setState({
      ...state,
      permissions: permissions
    })
  }

  useEffect(() => {
    fetchData()
  }, []);

  const onFinish = async (values: any): Promise<void> => {
    setLoading(true)
    let [error, result]: any[] = await to(rolePermissionService().withAuth().update({
      permissions: values,
      roleCode: roleCode
    }));

    setLoading(false)

    if (error) return notify(t(`errors:${error.code}`), t(error.message), 'error')

    notify(t("messages:message.recordRoleCreated"))
    redirect("frontend.admin.roles.index")

    return result
  }

  const renderCheckbox = (row: any, permission: number) => {
    const onChange = (e: any) => {
      e.target.checked ? row.currentValue += permission : row.currentValue -= permission;
      result[row.key] = row.currentValue
    }

    const checked = (row.currentValue & permission) === permission
    let disabled = (row.value & permission) !== permission
    if(!updatePer){
      disabled = true
    } 
    if(disabled) return <div></div>
    return <Checkbox defaultChecked={checked} onChange={onChange}></Checkbox>
  }

  const renderPermissionCategory = (category: any) => {
    const columns = [
      {
        title: "#",
        width: '5%',
        render: (text: string, record: any, index: number) => index + 1,
      },
      {
        title: category.name,
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: t("buttons:create"),
        dataIndex: 'value',
        key: 'valueC',
        width: '10%',
        align: 'center' as 'center',
        render: (value: any, row: any) => renderCheckbox(row, 8)
      },
      {
        title: t("buttons:view"),
        dataIndex: 'value',
        key: 'valueR',
        width: '10%',
        align: 'center' as 'center',
        render: (value: any, row: any) => renderCheckbox(row, 4)
      },
      {
        title: t("buttons:edit"),
        dataIndex: 'value',
        key: 'valueU',
        width: '10%',
        align: 'center' as 'center',
        render: (value: any, row: any) => renderCheckbox(row, 2)
      },
      {
        title: t("buttons:delete"),
        dataIndex: 'value',
        key: 'valueD',
        width: '10%',
        align: 'center' as 'center',
        render: (value: any, row: any) => renderCheckbox(row, 1)
      },
      {
        title: t("buttons:approve_reject"),
        dataIndex: 'value',
        key: 'valueAR',
        width: '10%',
        align: 'center' as 'center',
        render: (value: any, row: any) => renderCheckbox(row, 16)
      }
    ];

    return <Table size="small" key={Number(category.id)} columns={columns} rowKey="id" dataSource={category.permissions} pagination={false} />
  }

  if (!state.permissions.length) return <div className="content"><Spin /></div>

  return (
    <div className="content">
      {state.permissions.map((g: any) => renderPermissionCategory(g))}
      <div className="text-center" style={{ marginTop: "24px" }}>
        <Button onClick={() => router.back()} className="btn-margin-right">
          <LeftCircleFilled /> {t('buttons:back')}
        </Button>
        {
          !!updatePer &&  
        <Button onClick={() => onFinish(result)} type="primary" htmlType="submit" loading={loading} className="btn-margin-right">
          <SaveFilled /> {t('buttons:submit')}
        </Button>
        }
      </div>
    </div>
  )
}

Role.Layout = (props) => {
  const { t } = useBaseHook();

  return <Layout
    title={t("pages:roles.role.title")}
    description={t("pages:roles.role.description")}
    {...props}
  />
}

Role.permissions = {
  "roles": "R"
}

export default Role