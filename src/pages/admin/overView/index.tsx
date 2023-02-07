import dynamic from 'next/dynamic'
import DataTable, { Alignment } from 'react-data-table-component';
import {
  ArrowDownOutlined
} from "@ant-design/icons";
import { SearchOutlined, DashOutlined, SmallDashOutlined, MoreOutlined } from '@ant-design/icons';
import {Tooltip, Space, Input } from 'antd';

import {
  Pagination,
  Spin,
  Form,
  Typography,
  Button,
  Badge,
  Modal,
  Empty,
} from "antd";
const Layout = dynamic(() => import('@src/layouts/Admin'), { ssr: false })
import useBaseHook from '@src/hooks/BaseHook';

const Overview = () => {
  const { redirect, t } = useBaseHook();
  const { Search } = Input;
  // const sortIcon = <DashboardOutlined />

  const onSearch = (value: string) => console.log(value);

  const columns = [
    {
        name: t("pages:overView.OverviewDocumenttable.formId"),
        selector: row => row.title,
        sortable: true,
    },
    {
        name: t("pages:overView.OverviewDocumenttable.formName"),
        selector: row => row.year,
        sortable: true,
    },
    {
      name: '',
      cell: row=> <Button onClick={()=> console.log("row is ", row.id)}><MoreOutlined /></Button>
    }
];

const data = [
    {
        id: 1,
        title: 'Beetlejuice',
        year: '1988',
    },
    {
        id: 2,
        title: 'Ghostbusters',
        year: '1984',
    },
]

  return <>
    <div className="content">
        <DataTable
            columns={columns}
            data={data}
            // selectableRows
            // selectableRowsHighlight
            pagination
            fixedHeader
            fixedHeaderScrollHeight='450px'
            highlightOnHover
            subHeader
            subHeaderComponent={
              <Search placeholder=" search " width={10} allowClear onChange={(e)=>console.log("eval is ", e.target.value)} onSearch={onSearch} style={{ width: 200 }} />
            }
            subHeaderAlign={Alignment.LEFT}
            actions={<div style={{ float: "right" }}>
                      <Button size="small" onClick={()=>console.log("button is clicked")}>All</Button> 
                      <Button size="small" onClick={()=>console.log("button is clicked")}>To be Forwarded</Button>
                      <Button size="small" onClick={()=>console.log("button is clicked")}>Completed</Button>
                    </div>
                    }
            // dense
        />
    </div>
  </>
}

Overview.Layout = (props) => {
  const { t } = useBaseHook();
  return <Layout
    title={t('pages:overView.index.title')}
    description={t('pages:overView.index.description')}
    {...props}
  />
}

Overview.permissions = {
  'overView': "R",
};

export default Overview