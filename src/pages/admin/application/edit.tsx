import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import useBaseHook from "@src/hooks/BaseHook";
import { Row, Col } from "antd";
import to from "await-to-js";
import UpdateForm from "@root/src/components/Admin/Application/UpdateForm";
import documentsService from "@root/src/services/documentService";
import dayjs from 'dayjs';
import documentTemplateService from "@root/src/services/documentTemplateService";

const Layout = dynamic(() => import("@src/layouts/Admin"), { ssr: false });

const Edit = () => {
	const { t, notify, redirect, router } = useBaseHook();
	const { query } = router;
	const [documentData, setDocumentData] = useState(null);

	const fetchData = async () => {
		let idError: any = null;

		if (!query.id) {
			idError = {
				code: 9996,
				message: "missing ID",
			};
		}

		if (idError) return notify(t(`errors:${idError.code}`), "", "error");

		let [error, document]: [any, any] = await to(
			documentsService().withAuth().detail({ id: query.id })
		);
		let [errortemplate, documentTemplateFromObject]: [any, any] = await to(
			documentTemplateService().withAuth().detail({ id: parseInt(document?.documentTemplateId) })
		);

		if (error) return notify(t(`errors:${error.code}`), "", "error");

		if (error) return notify(t(`errors:${error.code}`), "", "error");
		const documentDataObject = document && {
			documentTemplateId:document.documentTemplateId,
			createdAt: document.createdAt,
			createdBy: document.createdBy,
			id: document.id,
			name: document.name,
			status: document.status,
			updatedAt: document.updatedAt,
			updatedBy: document.updatedBy,
			...document.content
		};
		console.log(documentDataObject);
		
		documentDataObject.birthday = dayjs(documentDataObject?.["birthday"]);
		setDocumentData(documentDataObject);
		localStorage.setItem("updatetemplate",JSON.stringify(documentTemplateFromObject));
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<>
			<div className="content">
				<UpdateForm documentData={documentData} />
			</div>
		</>
	);
};

Edit.Layout = (props) => {
	const { t } = useBaseHook();

	return (
		<Layout
			title={t("pages:documents.edit.title")}
			description={t("pages:documents.edit.description")}
			{...props}
		/>
	);
};

Edit.permissions = {
    "application": "U"
}

export default Edit;