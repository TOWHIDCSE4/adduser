import dynamic from "next/dynamic";
import {
	SearchOutlined,
	DashOutlined,
	FileSearchOutlined,
	MoreOutlined,
	FilePdfOutlined,
	FileOutlined,
	FilterOutlined,
} from "@ant-design/icons";
import {
	Pagination,
	Spin,
	Form,
	Typography,
	Button,
	Modal,
	Empty,
	Tooltip,
	Space,
	Input,
	Badge,
	Popover,
} from "antd";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { UserOptions } from "jspdf-autotable";
// import autoTable from 'jspdf-autotable'
const Layout = dynamic(() => import("@src/layouts/Admin"), { ssr: false });
import useBaseHook from "@src/hooks/BaseHook";
import { GridTable } from "@src/components/Table";
import FilterDatePicker from "@src/components/Table/SearchComponents/DatePicker";
import documentService from "@root/src/services/documentService";
import _ from "lodash";
import moment from "moment";
import to from "await-to-js";
import auth from "@src/helpers/auth";
import Cookies from "universal-cookie";
import React, { useState, useRef, useEffect } from "react";

const cookies = new Cookies();

function checkStatus(status: string) {
	let colorObj = {
		padding: "4px 8px",
		borderRadius: "5px",
		color: "#b22222",
		backgroundColor: "#fff6f6",
		width: "75px",
	};

	if (status === "Approve") {
		colorObj = {
			...colorObj,
			color: "#17B169",
			backgroundColor: "#cefad0",
			width: "70px",
		};
	} else if (status === "To Be Reviewed") {
		colorObj = {
			...colorObj,
			color: "#DAA520",
			backgroundColor: "#FFF8DC",
			width: "120px",
		};
	} else if (status == "Rejected") {
		colorObj = {
			...colorObj,
			color: "#b22222",
			backgroundColor: "#fff6f6",
			width: "75px",
		};
	}

	return colorObj;
}

const Index = () => {
	const { redirect, t, notify } = useBaseHook();
	const tableRef = useRef(null);
	const [selectedIds, setSelectedIds] = useState([]);
	const [documents, setDocuments] = useState(null);
	const [statusCount, setStatusCount] = useState(null);
	const [hiddenDeleteBtn, setHiddenDeleteBtn] = useState(true);

	const onSearch = (value: string) => console.log(value);

	const fetchData = async (values: any) => {
		if (!values.sorting.length) {
			values.sorting = [{ field: "documents.id", direction: "desc" }];
		}

		let [error, documents]: [any, any] = await to(
			documentService().withAuth().index(values)
		);

		if (error) {
			const { code, message } = error;
			notify(t(`errors:${code}`), t(message), "error");
			return {};
		}

		if (documents) {
			const resultObj = JSON.parse(JSON.stringify(documents));
			documents.data = documents.data.filter(
				(item: any) => item.status === 7
			);
			documents.total = documents.data.length;
			let result = _.countBy(resultObj.data, "status");
			setStatusCount(result);
			setDocuments(resultObj);
		}

		return documents;
	};

	const onChangeSelection = (data: any) => {
		if (data.length > 0) setHiddenDeleteBtn(false);
		else setHiddenDeleteBtn(true);
		setSelectedIds(data);
	};

	const rowSelection = {
		getCheckboxProps: (record) => ({
			disabled: record.id == auth().user.id,
			id: record.id,
		}),
	};

	const generatePdf = (rowInfo: any) => {
		return redirect("frontend.admin.application.documentpdf", {
			id: rowInfo.id,
		});
	};

	const columns = [
		{
			title: t("pages:documents.table.formName"),
			dataIndex: "name",
			key: "documents.name",
			sorter: true,
			filterable: true,
			render: (text, record) => {
				return <strong>{text}</strong>;
			},
		},
		{
			title: t("pages:documentsTemplate.table.submitter"),
			dataIndex: "createdBy",
			key: "documents.createdBy",
			sorter: true,
			filterable: true,
			render: (text, record) => {
				const user = cookies.get('user');
				return <strong>{user?.firstName} {user?.lastName}</strong>;
			}
		},
		{
			title: t("pages:documentsTemplate.table.submitDate"),
			dataIndex: "createdAt",
			key: "documents.createdAt",
			sorter: true,
			filterable: true,
			render: (text: string, record: any) =>
				text ? moment(text).format("LL") : "",
			renderFilter: ({ column, confirm, ref }: FilterParam) => (
				<FilterDatePicker column={column} confirm={confirm} ref={ref} />
			),
		},
		{
			title: t("pages:documents.table.updatedDate"),
			dataIndex: "updatedAt",
			key: "documents.updatedAt",
			sorter: true,
			filterable: true,
			render: (text: string, record: any) =>
				text ? moment(text).format("LL") : "",
			renderFilter: ({ column, confirm, ref }: FilterParam) => (
				<FilterDatePicker column={column} confirm={confirm} ref={ref} />
			),
		},
		{
			title: t("pages:documents.table.action"),
			key: "action",
			render: (text, record) => {
				return (
					<Space size="middle">
						<span
							onClick={(e) => {
								e.stopPropagation();
								generatePdf(record);
							}}
							title="Download PDF"
							style={{ cursor: "pointer" }}
						>
							<FilePdfOutlined style={{ fontSize: "21px" }} />
						</span>
						<span
							title="Download CSV"
							style={{ cursor: "pointer" }}
						>
							<FileOutlined style={{ fontSize: "20px" }} />
						</span>
					</Space>
				);
			},
		},
	];

	return (
		<>
			<div className="content">
				<GridTable
					ref={tableRef}
					columns={columns}
					fetchData={fetchData}
					rowSelection={{
						selectedRowKeys: selectedIds,
						onChange: (data: any[]) => onChangeSelection(data),
						...rowSelection,
					}}
					onRow={(record, rowIndex) => {
						return {
							onClick: (event) => {
								redirect("frontend.admin.application.edit", {
									id: record.id,
								});
							},
						};
					}}
					addIndexCol={false}
					selectableRowsHighlight
				/>
			</div>
		</>
	);
};

Index.Layout = (props) => {
	const { t } = useBaseHook();
	return (
		<>
			<Layout
				title={t("pages:documents.draftList.title")}
				description={t("pages:documents.draftList.description")}
				{...props}
			/>
		</>
	);
};

Index.permissions = {
	documents: "R",
};

export default Index;
