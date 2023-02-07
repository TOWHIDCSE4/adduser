import dynamic from "next/dynamic";
import { FilePdfOutlined, FileOutlined } from "@ant-design/icons";
import { Typography, Button, Space, Input, Badge } from "antd";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { UserOptions } from "jspdf-autotable";
// import autoTable from 'jspdf-autotable'
const Layout = dynamic(() => import("@src/layouts/Admin"), { ssr: false });
import useBaseHook from "@src/hooks/BaseHook";
import { GridTable } from "@src/components/Table";
import FilterDatePicker from "@src/components/Table/SearchComponents/DatePicker";
import documentTemplateService from "@root/src/services/documentTemplateService";
import _ from "lodash";
import moment from "moment";
import to from "await-to-js";
import auth from "@src/helpers/auth";
import React, { useState, useRef } from "react";
import documentService from "@root/src/services/documentService";
import constantConfig from "@config/constant";
import {
	checkStatusByName,
	checkStatusColor,
	getCountByStatus,
} from "@root/src/helpers/utils";
const { documentStatus } = constantConfig;

interface jsPDFWithPlugin extends jsPDF {
	autoTable: (options: UserOptions) => jsPDF;
}

const Index = () => {
	const { redirect, t, notify } = useBaseHook();
	const { Title } = Typography;
	const { Search } = Input;
	const ButtonGroup = Button.Group;
	const tableRef = useRef(null);
	const [selectedIds, setSelectedIds] = useState([]);
	const [documentTemplates, setDocumentTemplates] = useState(null);
	const [document, setDocuments] = useState(null);
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
			setDocuments(resultObj);
		}
		
		const countByStatus = await getCountByStatus(documents?.data);

		Object.keys(countByStatus).map((item) => {
			if (documentStatus.hasOwnProperty(item)) {
				countByStatus[documentStatus[item]] = countByStatus[item];
				delete countByStatus[item];
			}
		});

		setStatusCount(countByStatus);
		
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
				return <strong>{record?.content.firstName} {record?.content.lastName}</strong>;
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
			title: t("pages:documentsTemplate.table.status"),
			dataIndex: "status",
			key: "documents.status",
			sorter: true,
			filterable: true,
			render: (text, record) => {
				return (
					<div style={checkStatusColor(text)}>
						{checkStatusByName(text)}
					</div>
				);
			},
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
			title: t("pages:documentsTemplate.table.action"),
			key: "action",
			render: (text, record) => {
				return (
					<Space size="middle">
						<span
							onClick={(e) => {
                e.stopPropagation();
                generatePdf(record)}}
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
				<div style={{ float: "right", marginBottom: "10px" }}>
					{statusCount && (
						<div>
							<ButtonGroup>
								<Button
									onClick={() =>
										console.log("All button is clicked")
									}
								>
									<Badge
										count={statusCount["Approve"]}
										style={{
											color: "#17B169",
											backgroundColor: "#cefad0",
										}}
									/>
									<span style={{ marginLeft: 5 }}>
										{" "}
										Approve
									</span>
								</Button>
								<Button
									onClick={() =>
										console.log(
											"To Be Reviewed button is clicked"
										)
									}
								>
									<Badge
										count={statusCount["To Be Reviewed"]}
										style={{
											color: "#DAA520",
											backgroundColor: "#FFF8DC",
										}}
									/>
									<span style={{ marginLeft: 5 }}>
										{" "}
										To Be Reviewed
									</span>
								</Button>
								<Button
									onClick={() =>
										console.log(
											"Rejected button is clicked"
										)
									}
								>
									<Badge
										count={statusCount["Rejected"]}
										style={{
											color: "#b22222",
											backgroundColor: "#fff6f6",
										}}
									/>
									<span style={{ marginLeft: 5 }}>
										{" "}
										Rejected
									</span>
								</Button>
							</ButtonGroup>
						</div>
					)}
				</div>

				<GridTable
					ref={tableRef}
					columns={columns}
					fetchData={fetchData}
					rowSelection={{
						selectedRowKeys: selectedIds,
						onChange: (data: any[]) => onChangeSelection(data),
						...rowSelection,
					}}
					addIndexCol={false}
					selectableRowsHighlight
					onRow={(record, rowIndex) => {
						return {
							onClick: (event) => {
								redirect("frontend.admin.application.edit", {
									id: record.id,
								});
							},
						};
					}}
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
				title={t("pages:documentsTemplate.SubmittedList.title")}
				description={t("pages:documentsTemplate.SubmittedList.description")}
				{...props}
			/>
		</>
	);
};

Index.permissions = {
	document_templates: "R",
};

export default Index;