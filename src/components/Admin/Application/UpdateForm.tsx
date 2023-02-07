import documentsService from "@root/src/services/documentService";
import useBaseHook from "@src/hooks/BaseHook";
import { Button, Col, Form, Row, Tabs } from "antd";
import to from "await-to-js";
import clsx from "clsx";
import _ from "lodash";
import { useEffect, useState } from "react";
import { CommonForm } from "./CommonForm";

const DynamicFormPage = ({ documentData }) => {
  const { t, notify, redirect, router } = useBaseHook();
  const { query } = router;
  const [formJsonSchema, setFormJsonSchema]:any = useState();
  const [templateId, setTemplateId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [buttonId, setButtonId] = useState(6);

  const onFinish = async (data: any): Promise<void> => {
    setLoading(true);
    let idError: any = null;

    if (!query.id) {
      idError = {
        code: 9996,
        message: "missing ID",
      };
    }

    if (idError) return notify(t(`errors:${idError.code}`), "", "error");

    const documentReqBody = {
      id: query.id,
      name: "Staff Insurance",
      content: JSON.stringify(data),
      status: buttonId,
      documentTemplateId: templateId,
      createdBy: null,
      updatedBy: null,
    };

    let [error, result]: any[] = await to(
      documentsService().edit(documentReqBody)
    );

    if (error) return notify(t(`errors:${error.code}`), "", "error");

    setLoading(false);
    notify(t("messages:message.staffInsuranceFormUpdateSuccess"));
    redirect("frontend.admin.application.index");

    return result;
  };

  const onFinishFailed = (errorInfo: any): void => {
    console.log("Failed:", errorInfo);
  };
  useEffect(() => {
    const updatetemplate = localStorage.getItem("updatetemplate");
    let template = JSON.parse(localStorage.getItem("updatetemplate"));

    if (template) {
      setTemplateId(template.id);
      setFormJsonSchema(template.content);
    }
  }, []);
  if (!documentData) return <></>;

  return (
    <div className="content-documents">
      <Form
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
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
                  <Row gutter={[6,6]}>
                    {item[1].map((fieldValue, i) => {
                      return (
                        <>
                          <Col
                            key={i}
                            xs={fieldValue.col.xs}
                            sm={fieldValue.col.sm}
                            md={fieldValue.col.md}
                            lg={fieldValue.col.lg}
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
            <TabComment item={documentData} form={form}  />
          </fieldset>
        </div>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button
            style={{ backgroundColor: "black" }}
            type="primary"
            onClick={() => router.back()}
          >
            {t("buttons:back")}
          </Button>

          <Button
            style={{ marginLeft: 10, backgroundColor: "green" }}
            type="primary"
            htmlType="submit"
          >
            Submit
          </Button>

          {documentData.status !== 7 && (
            <Button
              onClick={() => setButtonId(1)}
              style={{ marginLeft: 10, backgroundColor: "blue" }}
              type="primary"
              htmlType="submit"
            >
              Approve
            </Button>
          )}

          {documentData.status !== 7 && (
            <Button
              onClick={() => setButtonId(3)}
              style={{ marginLeft: 10, backgroundColor: "red" }}
              type="primary"
              htmlType="submit"
            >
              Rejected
            </Button>
          )}
          {documentData.status !== 7 && (
            <Button
              onClick={() => setButtonId(2)}
              style={{ marginLeft: 10, backgroundColor: "orange" }}
              type="primary"
              htmlType="submit"
            >
              To Be Reviewed
            </Button>
          )}
        </Form.Item>
      </Form>
    </div>
  );
};

export default DynamicFormPage;

const TabComment = ({item,form}) => {
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
                  isDisabled: false,
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
                  isDisabled: item.item.issueComment ? true : false,
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
                  isDisabled: item.item.issueComment ? true : false,
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