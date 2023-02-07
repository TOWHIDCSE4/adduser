import { documentStatus } from "@root/config/constant";
import to from "await-to-js";
import { useEffect, useState } from "react";
import { getCountByStatus } from "../helpers/utils";
import documentService from "../services/documentService";
import useBaseHooks from "./BaseHook";

const useStatusCount = () => {
	const { t, redirect, notify } = useBaseHooks();
	const [document, setDocuments] = useState(null);
	const [statusCount, setStatusCount] = useState(null);

	const fetchData = async (values?: any) => {
		let [error, documents]: [any, any] = await to(
			documentService().withAuth().index(values)
		);

		if (error) {
			const { code, message } = error;
			notify(t(`errors:${code}`), t(message), "error");
			return {};
		}

		const countByStatus = await getCountByStatus(documents?.data);
		console.log("🚀 ~ file: StatusCount.tsx:25 ~ fetchData ~ countByStatus", countByStatus)

		Object.keys(countByStatus).map((item) => {
			if (documentStatus.hasOwnProperty(item)) {
				// re-name object keys
				countByStatus[documentStatus[item]] = countByStatus[item];
				// delete previous key
				delete countByStatus[item];
			}
			
			
		});

		setStatusCount(countByStatus);
		setDocuments(documents.total - countByStatus["Draft"]);
		return documents;
	};

	useEffect(() => {
		fetchData();
	}, []);

	return {
		...statusCount,
		total: document,
	};
};

export default useStatusCount;