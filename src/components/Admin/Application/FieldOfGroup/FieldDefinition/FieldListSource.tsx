import React, {useState } from "react";
import {
  Form,
  Col,
  Row,
  Input,
  Select,
  Button,
} from "antd";
import useBaseHook from "@src/hooks/BaseHook";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const listSourceTypes = ["database", "manual"];
const tables = ["users", "roles", "companies"];

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

const FieldListSource = ({ nameListSource }) => {
  const [sourceType, setSourceType] = useState<"database" | "manual">(
    "database"
  );
  const { t } = useBaseHook();

  return (
    <>
      <Col span={12}>
        <Form.Item
          {...formItemLayout}
          name={[nameListSource, "listSelect", "sourceType"]}
          label={t(
            "pages:documentTemplates.create.fieldInformation.sourceType"
          )}
          rules={[
            {
              required: true,
              message: t("messages:form.required", {
                name: t(
                  "pages:documentTemplates.create.fieldInformation.sourceType"
                ),
              }),
            },
          ]}
        >
          <Select
            placeholder={t(
              "pages:documentTemplates.create.fieldInformation.sourceType"
            )}
            onChange={(value) => {
              setSourceType(value);
            }}
          >
            {listSourceTypes.map((listSourceType) => (
              <Select.Option key={listSourceType} value={listSourceType}>
                {listSourceType}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      {
        sourceType == "database" ?(
          <Col span={12}>
          <Form.Item
            {...formItemLayout}
            name={[nameListSource, "list", "source"]}
            label={t("pages:documentTemplates.create.fieldInformation.source")}
            rules={[
              {
                required: true,
                message: t("messages:form.required", {
                  name: t(
                    "pages:documentTemplates.create.fieldInformation.source"
                  ),
                }),
              },
            ]}
          >
            <Select
              placeholder={t("pages:documentTemplates.create.fieldInformation.source")}
            >
              {tables.map((table) => (
                <Select.Option key={table} value={table}>
                  {table}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          </Col>
        ):(
          <Col span={24}>
          <Form.List name={[nameListSource, "listSelect", "source"]}>
            {(fields, { add, remove }) => (
              <div onClick={(e) => e.stopPropagation()}>
                {fields.map((field, index, fullarr) => {
                  let { key, name, ...restField } = field;
                  return (
                    <Row key={key} style={{textAlign: 'center'}}>
                      <Col span={4}></Col>
                      <Col span={7}>
                        <Form.Item
                          name={[name,'key']}
                          rules={[{ required: true, message: 'Missing Key Option' }]}
                        >
                          <Input placeholder="Key Option" />
                        </Form.Item>
                      </Col>
                      <Col span={1}></Col>
                      <Col span={7}>
                      <Form.Item
                        name={[name,'value']}
                        rules={[{ required: true, message: 'Missing Value Option' }]}
                      >
                        <Input placeholder="Value Option" />
                      </Form.Item>
                      </Col>
                      <Col span={1}>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                      </Col>
                    </Row>
                  );
                })}
                <Form.Item className="text-center">
                  <Button
                    type="dashed"
                    onClick={() => {
                      add();
                    }}
                    icon={<PlusOutlined />}
                    style={{ width: "60%" }}
                  >
                    Add field
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form.List>
        </Col>
        )
      }
    </>
  );
};

export default FieldListSource;
