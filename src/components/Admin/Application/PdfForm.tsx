import React, { useEffect, useState } from "react";
import { CommonForm } from "./CommonForm";
import useBaseHook from "@src/hooks/BaseHook";
import { Button, Row, Col, Tabs, Form } from "antd";
import to from "await-to-js";
import documentsService from "@root/src/services/documentService";
import _ from "lodash";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import clsx from "clsx";

const DynamicFormPage = ({ documentData }) => {
  const { t, notify, redirect, router } = useBaseHook();
  const { query } = router;
	const [formJsonSchema, setFormJsonSchema]:any[] = useState();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  let buttonId = 6;


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
		const updatetemplate = localStorage.getItem("updatetemplate")
		let template= JSON.parse(localStorage.getItem('updatetemplate'));
		
		if (template) {
			setFormJsonSchema(template.content);
		}
	  }, []);
  if (!documentData) return <></>;

  return (
    <div className="content-documents App" id="content">
      <Form
        autoComplete="off"
        initialValues={documentData}
        form={form}
        layout="vertical"
      >
        {Object.entries(_.groupBy(formJsonSchema, "groupTitle")).map(
          (item, i) => {
            return (
              <>
                <div className="form-group">
                  <h2>{item[0]}</h2>
                  <Row className="form-container">
                    {item[1].map((fieldValue, i) => {
                      return (
                        <>
                          <Col
                            key={i}
                            xs="field.Col.xs"
                            lg="field.Col.lg"
                            order={fieldValue.position}
                            className={clsx({
                              "row-span-2":
                                fieldValue.inputType === "fileInput",
                              "col-span-full":
                                fieldValue.fieldName === "street" ||
                                fieldValue.fieldName === "officeStreet",
                            })}
                          >
                            <CommonForm formField={fieldValue} form={form} />
                          </Col>
                        </>
                      );
                    })}
                  </Row>
                </div>
              </>
            );
          }
        )}

        <div style={{ paddingTop: 10, paddingBottom: 10 }}>
          <fieldset className="fieldset">
            <TabComment form={form}  />
          </fieldset>
        </div>

        <div className="ToHide">

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button style={{backgroundColor:"black"}} type="primary" onClick={() => router.back()}>
						{t("buttons:back")}
					</Button>
            <Button
              onClick={exportPdf}
              style={{ marginLeft: 10 }}
              type="primary"
            >
              Export PDF
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default DynamicFormPage;

const TabComment = (form) => {
  return (
    <>
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: `Issuer Comment`,
            key: "1",
            children: (
              <CommonForm
                formField={{
                  fieldName: "issueComment",
                  dataType: "text",
                  inputType: "textAreaInput",
                  position: 6,
                  defaultValue: "",
                  list: {},
                  col: {
                    xs: 2,
                    lg: 3,
                  },
                  validation: [],
                }}
                form={form}
              />
            ),
          },
          {
            label: `Tenant Admin Comment`,
            key: "2",
            children: (
              <CommonForm
                formField={{
                  fieldName: "adminComment",
                  dataType: "text",
                  inputType: "textAreaInput",
                  position: 6,
                  defaultValue: "",
                  list: {},
                  col: {
                    xs: 2,
                    lg: 3,
                  },
                  validation: [],
                }}
                form={form}
              />
            ),
          },
          {
            label: `Individual Comment`,
            key: "3",
            children: (
              <CommonForm
                formField={{
                  fieldName: "individualComment",
                  dataType: "text",
                  inputType: "textAreaInput",
                  position: 6,
                  defaultValue: "",
                  list: {},
                  col: {
                    xs: 2,
                    lg: 3,
                  },
                  validation: [],
                }}
                form={form}
              />
            ),
          },
        ]}
      />
    </>
  );
};