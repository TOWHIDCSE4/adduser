import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { GridTable } from '@src/components/Table';
import { confirmDialog } from '@src/helpers/dialogs'
import FilterDatePicker from '@src/components/Table/SearchComponents/DatePicker'
import { Button,Modal , Tag ,Card  } from 'antd';
import tenantService from '@src/services/tenantService';
import to from 'await-to-js'
import moment from 'moment'
import useBaseHook from '@src/hooks/BaseHook'
import { PlusCircleOutlined, DeleteOutlined, EditOutlined,SyncOutlined,CheckCircleOutlined } from '@ant-design/icons';
import usePermissionHook from "@src/hooks/PermissionHook";
import arrayToTree from "array-to-tree";
import _ from "lodash";

const Layout = dynamic(() => import('@src/layouts/Admin'), { ssr: false })

const Index = () => {
  const { t, notify, redirect } = useBaseHook();
  const tableRef = useRef(null)
  const [hiddenDeleteBtn, setHiddenDeleteBtn] = useState(true)
  const [selectedIds, setSelectedIds] = useState([])
  const { checkPermission } = usePermissionHook();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contentModal, setContentModal] = useState([]);
  const [loading, setLoading] = useState(false);

  const activePer = checkPermission({
    "tenants": "A"
  })
  const createPer = checkPermission({
    "tenants": "C"
  })
  const deletePer = checkPermission({
    "tenants": "D"
  })
  const updatePer = checkPermission({
    "tenants": "U"
  })
  const columns = [
    {
      title: t('pages:tenants.table.name'),
      dataIndex: 'name',
      key: 'tenants.name',
      sorter: true,
      filterable: true,
      render: (text: string, record: any) => {
        return updatePer ? (
          <a onClick={() => redirect('frontend.admin.tenants.edit', { id: record.code })}>
            <span className="show-on-hover">
              {record.name}
              <EditOutlined className="show-on-hover-item" />
            </span>
          </a>
        ) : record.name
      }
    },
    {
      title: t("pages:tenants.table.email"),
      dataIndex: 'email',
      key: 'tenants.email',
      sorter: true,
      filterable: true,
    },
    {
      title: t("pages:tenants.table.phone"),
      dataIndex: 'phone',
      key: 'tenants.phone',
      sorter: true,
      filterable: true,
    },
    {
      title: t("pages:tenants.table.address"),
      dataIndex: 'address',
      key: 'tenants.address',
      sorter: true,
      filterable: true,
    },
    {
      title: t("pages:tenants.table.account"),
      dataIndex: 'other',
      key: 'tenants.other',
      sorter: false,
      filterable: false,
      render: (text: string, record: any) => {
          return <div>
           {record?.others?.username} 
          </div>
      },
    },
    {
      title: t("pages:tenants.table.state"),
      dataIndex: 'state',
      key: 'tenants.state',
      sorter: true,
      filterable: true,
      render: (text: string, record: any) => {
        if (record.state == "active") return (
          <Tag icon={<CheckCircleOutlined />} color="success">
            ACTIVE
          </Tag>
        )
        return (
          <Tag icon={<SyncOutlined spin />} color="processing">
             DEACTIVE
          </Tag>
        )
      },
    },
    {
      title: t("pages:tenants.table.createdAt"),
      dataIndex: 'createdAt',
      key: 'tenants.createdAt',
      sorter: true,
      filterable: true,
      render: (text: string, record: any) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : "",
      renderFilter: ({ column, confirm, ref }: FilterParam) =>
        <FilterDatePicker column={column} confirm={confirm} ref={ref} />
    },
    {
      title: t("pages:tenants.table.actions"),
      dataIndex: 'Action',
      key: "Action",
      render: (text: string, record: any) => {
        if (record.state != "active") {
          return (<>
            {(activePer)?(
              <Button 
                loading={loading}
                type="primary"
                onClick={() => {
                  confirmDialog({
                    title: t('buttons:active'),
                    content: t('messages:message.activeConfirm'),
                    onOk: () => activeTenants({code: record.code})
                  })
                }}
              >
                {"ACTIVE"}
              </Button>
            ) : null}
          </>
          )
        }
        return <Tag icon={<CheckCircleOutlined />} color="success">
            success
        </Tag>
      }
    }
  ]

  const activeTenants = async ({code}:{code: string}) => {
    setLoading(true)
    let [error, tenant]: [any, Tenant] = await to(tenantService().withAuth().active({code: code}))
    if (error) {
      const { code, message } = error
      notify(t(`errors:${code}`), '', 'error')
      return {}
    }
    notify(t("messages:message.recordTenantsactived"))
    tableRef.current.reload()
    setContentModal([
      <div>
        <div style={{textAlign: 'center'}}>
          <Tag icon={<CheckCircleOutlined />} color="success">
          {t("messages:message.recordTenantsactived")}
          </Tag>
        </div>
        <br/>
        <Card title="Tenant">
          <p>Name tenant: {tenant.name}</p>
          <p>Email tenant: {tenant.email}</p>
          <p>Phone tenant: {tenant.phone}</p>
          <p>Address tenant: {tenant.address}</p>
        </Card>
        <br/>
        <Card title="Account Admin">
        <p>Username: {tenant.others.username}</p>
        <p>Password: {tenant.others.password}</p>
        </Card>
      </div>
    ])
    setLoading(false)
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setContentModal([])
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setContentModal([])
    setIsModalOpen(false);
  };

  const onChangeSelection = (data: any) => {
    if (data.length > 0) setHiddenDeleteBtn(false)
    else setHiddenDeleteBtn(true)
    setSelectedIds(data)
  }


  const rowSelection = {
    getCheckboxProps: (record) => ({
      disabled: record.id == 1,
      id: record.id,
    }),
  };

  const fetchData = async (values: any) => {
    if (!values.sorting.length) {
      values.sorting = [
        { field: "tenants.id", direction: "desc" },
      ]
    }
    values['pageSize'] = -1;
    let [error, tenants]: [any, Tenant[]] = await to(tenantService().withAuth().index(values))
    if (error) {
      const { code, message } = error
      notify(t(`errors:${code}`), '', 'error')
      return {}
    }
    let data: any[] = _.get(tenants, "data", []);
    data = arrayToTree(data, { parentProperty: "parentId" });
    return {
      ...tenants,
      data: data,
    }
  }

  const onDelete = async () => {
    let [error, result]: any[] = await to(tenantService().withAuth().delete({ ids: selectedIds }));
    if (error) return notify(t(`errors:${error.code}`), '', 'error')

    notify(t("messages:message.recordRoleDeleted"));

    if (tableRef.current !== null) {
      tableRef.current.reload()
    }

    setSelectedIds([])
    setHiddenDeleteBtn(true)
  }

  return (
    <div className="content">
      <Button hidden={!createPer}
        onClick={() => redirect("frontend.admin.tenants.create")}
        type="primary"
        className='btn-top'
      >
        <PlusCircleOutlined />
        {t('buttons:create')}
      </Button>
      <Button
        type="primary" danger
        className='btn-top'
        hidden={hiddenDeleteBtn || !deletePer}
        onClick={() => {
          confirmDialog({
            title: t('buttons:deleteItem'),
            content: t('messages:message.deleteConfirm'),
            onOk: () => onDelete()
          })
        }}
      >
        <DeleteOutlined />
        {t('buttons:delete')}
      </Button>
      <GridTable
        ref={tableRef}
        columns={columns}
        fetchData={fetchData}
        rowSelection={{ 
          selectedRowKeys: selectedIds, 
          onChange: (data: any[]) => onChangeSelection(data),
          checkStrictly: true, 
          ...rowSelection
        }}
        addIndexCol={false}
        rowKey={'id'}
      />
      <Modal 
        open={isModalOpen} 
        onOk={handleOk} 
        onCancel={handleCancel}
        footer={[
          <Button key="submit" type="primary" onClick={handleOk}>
            Done!
          </Button>
        ]}
      >
        {contentModal}
      </Modal>
    </div>
  )
}

Index.Layout = (props) => {
  const { t } = useBaseHook();

  return <Layout
    title={t("pages:tenants.index.title")}
    description={t("pages:tenants.index.description")}
    {...props}
  />
}

Index.permissions = {
  "tenants": "R"
};

export default Index