import documentsService from "@root/src/services/documentService";
import useBaseHook from "@src/hooks/BaseHook";
import { Button, Col, Form, Row, Tabs } from "antd";
import to from "await-to-js";
import clsx from "clsx";
import _ from "lodash";
import { useEffect, useState } from "react";
import { CommonForm } from "./CommonForm";

const DynamicFormPage = () => {
  const { t, notify, redirect, router } = useBaseHook();
  const [formJsonSchema, setFormJsonSchema]:any[] = useState();
  const [templateId, setTemplateId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  let buttonId = 6;

  const onFinish = async (data: any): Promise<void> => {
    setLoading(true);
    const documentReqBody = {
      name: "Staff Insurance",
      content: JSON.stringify(data),
      status: buttonId,
      documentTemplateId: templateId,
      createdBy: null,
      updatedBy: null,
    };

    let [error, result]: any[] = await to(
      // documentTemplateService().create(templateReqBody),
      documentsService().create(documentReqBody)
    );

    if (error) return notify(t(`errors:${error.code}`), "", "error");

    setLoading(false);
    notify(t("messages:message.staffInsuranceFormSuccess"));
    redirect("frontend.admin.application.index");
    console.log(data);

    return result;
  };

  const onFinishFailed = (errorInfo: any): void => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    const template = JSON.parse(localStorage.getItem("template"));
    if (template) {
      setTemplateId(template.id);
      setFormJsonSchema(template.content);
    }
  }, []);

  return (
    <div className="content-documents">
      <Form
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="vertical"
        form={form}
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
            <TabComment form={form} />
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
            type="primary"
            style={{ marginLeft: 10, backgroundColor: "green" }}
            htmlType="submit"
          >
            Submit
          </Button>

          <Button
            onClick={() => (buttonId = 7)}
            style={{ marginLeft: 10, backgroundColor: "purple" }}
            type="primary"
            htmlType="submit"
          >
            Draft
          </Button>
        </Form.Item>
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