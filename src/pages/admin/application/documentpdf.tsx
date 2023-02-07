import dynamic from "next/dynamic";
import useBaseHook from "@src/hooks/BaseHook";
import React, { useEffect, useState } from "react";
import { Button, Row, Col, Tabs, Form } from "antd";
import to from "await-to-js";
import documentTemplateService from "@root/src/services/documentTemplateService";
import documentsService from "@root/src/services/documentService";
import PdfForm from "@root/src/components/Admin/Application/PdfForm";
import _ from "lodash";
import { CommonForm } from "@root/src/components/Admin/Application/CommonForm";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import clsx from "clsx";
import dayjs from 'dayjs';

const Layout = dynamic(() => import("@src/layouts/Admin"), { ssr: false });

const DocumentPDF = () => {
    const { t, notify, redirect, router } = useBaseHook();
    const [formJsonSchema, setFormJsonSchema] = useState('');
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    let buttonId = 6;
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
        const documentDataObject = document && {
            documentTemplateId: document.documentTemplateId,
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

    const exportPdf = async () => {
        const hide = document.querySelectorAll(".ToHide");
        const width = document.getElementById("content").offsetWidth;
        const height = document.getElementById("content").offsetHeight;
        const pdfcanvas = document.createElement('canvas');
        const pdfcontext = pdfcanvas.getContext('2d');
        hide.forEach((element:any) => {
            element.style.visibility = "hidden";
        });
        await html2canvas(document.querySelector(".App"), { useCORS: true, scale: 3 }).then((canvas) => {
            const contentDataURL = canvas.toDataURL('image/jpeg', 1)
            let pdf = new jsPDF('p', 'mm', "a4");
            let pdfWidth = pdf.internal.pageSize.getWidth()
            let pdfHeight = pdf.internal.pageSize.getHeight()
            // pdf.addImage(contentDataURL, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            // // window.open(pdf.output('bloburl', { filename: 'new-file.pdf' }), '_blank')
            // pdf.save("application.pdf");
            pdfcanvas.width = canvas.width / 2
            pdfcanvas.height = canvas.height / 2
            pdfcontext.drawImage(canvas, 0, 0, canvas.width / 2, canvas.height / 2)
            const frame = pdfcanvas.toDataURL('image/png')
            pdf.addImage(frame, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            pdf.save("application.pdf");
        });

    };

    useEffect(() => { 
        fetchData();
    }, []);

    if (!documentData) return <></>;
    return (
        <>

            <div className="content App" id="content">
                <PdfForm documentData={documentData} />
            </div>
        </>
    );
};

// const TabComment = (item) => {
//     return (
//         <>
//             <Tabs
//                 defaultActiveKey="1"
//                 items={[
//                     {
//                         label: `Issuer Comment`,
//                         key: "1",
//                         children: (
//                             <CommonForm
//                                 formField={{
//                                     fieldName: "issueComment",
//                                     dataType: "text",
//                                     inputType: "textAreaInput",
//                                     position: 6,
//                                     defaultValue: "",
//                                     list: {},
//                                     col: {
//                                         xs: 2,
//                                         lg: 3,
//                                     },
//                                     validation: [],
//                                 }}
//                             />
//                         ),
//                     },
//                     {
//                         label: `Tenant Admin Comment`,
//                         key: "2",
//                         children: (
//                             <CommonForm
//                                 formField={{
//                                     fieldName: "adminComment",
//                                     dataType: "text",
//                                     inputType: "textAreaInput",
//                                     position: 6,
//                                     defaultValue: "",
//                                     list: {},
//                                     col: {
//                                         xs: 2,
//                                         lg: 3,
//                                     },
//                                     validation: [],
//                                 }}
//                             />
//                         ),
//                     },
//                     {
//                         label: `Individual Comment`,
//                         key: "3",
//                         children: (
//                             <CommonForm
//                                 formField={{
//                                     fieldName: "individualComment",
//                                     dataType: "text",
//                                     inputType: "textAreaInput",
//                                     position: 6,
//                                     defaultValue: "",
//                                     list: {},
//                                     col: {
//                                         xs: 2,
//                                         lg: 3,
//                                     },
//                                     validation: [],
//                                 }}
//                             />
//                         ),
//                     },
//                 ]}
//             />
//         </>
//     );
// };

DocumentPDF.Layout = (props) => {
    const { t } = useBaseHook();

    return (
        <Layout
             title={t("pages:documents.details.title")}
            description={t("pages:documents.details.description")}
            {...props}
        />
    );
};

DocumentPDF.permissions = {
    "application": "R"
}

export default DocumentPDF;