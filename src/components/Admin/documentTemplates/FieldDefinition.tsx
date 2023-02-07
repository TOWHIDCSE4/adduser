import React, { useRef, useState } from "react";
import {
  Form,
  Col,
  Row,
  Input,
  Card,
  Select,
  InputNumber,
  Tag,
  Button,
} from "antd";
import useBaseHook from "@src/hooks/BaseHook";
import type { CustomTagProps } from "rc-select/lib/BaseSelect";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const dataTypes = ["number", "string", "datetime", "file"];
const inputTypes = [
  "numberInput",
  "textInput",
  "dateTimeInput",
  "selectInput",
  "fileInput",
];
const listSourceTypes = ["database", "manual"];
const tables = ["users", "roles", "companies"];
const validations = [
  {
    label: "Required",
    value: "required",
  },
  {
    label: "Whitespace",
    value: "whitespace",
  },
  {
    label: "Max",
    value: "max",
  },
];

const tagRender = (props: CustomTagProps) => {
  const { label, closable, onClose } = props;
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <Tag
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3 }}
    >
      {label}
    </Tag>
  );
};

const FieldDefinition = ({ formValue }) => {
  const [isNeedList, setIsNeedList] = useState<boolean>(false);
  const [needList, setNeedList] = useState([]);
  const [sourceType, setSourceType] = useState<"database" | "manual">(
    "database"
  );
  const elementRef = useRef([]);
  const elementNeedRef = useRef([]);
  const { t } = useBaseHook();

  const onChangeInputType = async (value, options, key, field) => {
    // if (value == 'selectInput') setIsNeedList(true)
    // else setIsNeedList(false)
    if (value === "selectInput") {
      setIsNeedList(true);
      try {
        await formValue
        .getFieldValue()
        .createDocumentTemplates.map((item, index) => {
          if (index === key) {
            item.needlist = true;
            let newArr = [...needList]; // copying the old datas array
            // a deep copy is not needed as we are overriding the whole object below, and not setting a property of it. this does not mutate the state.
            newArr[index]["needlist"] = true; // replace e.target.value with whatever you want to change it to

            setNeedList(newArr);
          }
        });
      console.log(elementRef.current[key], field);
      } catch (error) {
        console.error(error)
      }
      
    } else {
    
      await formValue
        .getFieldValue()
        .createDocumentTemplates.map((item, index) => {
          if (index === key) {
            item.needlist = false;
            let newArr = [...needList]; // copying the old datas array
            // a deep copy is not needed as we are overriding the whole object below, and not setting a property of it. this does not mutate the state.
            newArr[index]["needlist"] = false; // replace e.target.value with whatever you want to change it to

            setNeedList(newArr);
            setIsNeedList(true);
          }
        });
    }
  };

  return (
    <>
      <Form.List name="createDocumentTemplates">
        {(fields, { add, remove }) => (
          <div onClick={(e) => e.stopPropagation()}>
            {fields.map((field, index, fullarr) => {
              let { key, name, ...restField } = field;
              return (
                <div key={String(key)}>
                  <Card
                    title={t(
                      "pages:documentTemplates.create.fieldInformation.title"
                    )}
                    style={{ width: "100%", marginBottom: "50px" }}
                    extra={
                      <MinusCircleOutlined
                        className="remove"
                        onClick={() => remove(name)}
                      />
                    }
                  >
                    <Row gutter={[32, 0]}>
                      <Col span={12}>
                        <Form.Item
                          labelCol={{ xs: 6 }}
                          labelAlign={"left"}
                          {...field}
                          name={[name, "fieldName"]}
                          label={t(
                            "pages:documentTemplates.create.fieldInformation.fieldName"
                          )}
                          rules={[
                            {
                              required: true,
                              message: t("messages:form.required", {
                                name: t(
                                  "pages:documentTemplates.create.fieldInformation.fieldName"
                                ),
                              }),
                            },
                            {
                              whitespace: true,
                              message: t("messages:form.required", {
                                name: t(
                                  "pages:documentTemplates.create.fieldInformation.fieldName"
                                ),
                              }),
                            },
                            {
                              max: 255,
                              message: t("messages:form.maxLength", {
                                name: t(
                                  "pages:documentTemplates.create.fieldInformation.fieldName"
                                ),
                                length: 255,
                              }),
                            },
                          ]}
                        >
                          <Input
                            placeholder={t(
                              "pages:documentTemplates.create.fieldInformation.fieldName"
                            )}
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          labelCol={{ xs: 6 }}
                          labelAlign={"left"}
                          {...field}
                          name={[name, "label"]}
                          label={t(
                            "pages:documentTemplates.create.fieldInformation.label"
                          )}
                          rules={[
                            {
                              required: true,
                              message: t("messages:form.required", {
                                name: t(
                                  "pages:documentTemplates.create.fieldInformation.label"
                                ),
                              }),
                            },
                            {
                              whitespace: true,
                              message: t("messages:form.required", {
                                name: t(
                                  "pages:documentTemplates.create.fieldInformation.label"
                                ),
                              }),
                            },
                            {
                              max: 255,
                              message: t("messages:form.maxLength", {
                                name: t(
                                  "pages:documentTemplates.create.fieldInformation.label"
                                ),
                                length: 255,
                              }),
                            },
                          ]}
                        >
                          <Input
                            placeholder={t(
                              "pages:documentTemplates.create.fieldInformation.label"
                            )}
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          labelCol={{ xs: 6 }}
                          labelAlign={"left"}
                          {...field}
                          name={[name, "dataType"]}
                          label={t(
                            "pages:documentTemplates.create.fieldInformation.dataType"
                          )}
                          rules={[
                            {
                              required: true,
                              message: t("messages:form.required", {
                                name: t(
                                  "pages:documentTemplates.create.fieldInformation.dataType"
                                ),
                              }),
                            },
                          ]}
                        >
                          <Select
                            placeholder={t(
                              "pages:documentTemplates.create.fieldInformation.dataType"
                            )}
                            style={{ width: "100%" }}
                          >
                            {dataTypes.map((dataType) => (
                              <Select.Option key={dataType} value={dataType}>
                                {dataType}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          labelCol={{ xs: 6 }}
                          labelAlign={"left"}
                          {...field}
                          name={[name, "inputType"]}
                          label={t(
                            "pages:documentTemplates.create.fieldInformation.inputType"
                          )}
                          rules={[
                            {
                              required: true,
                              message: t("messages:form.required", {
                                name: t(
                                  "pages:documentTemplates.create.fieldInformation.inputType"
                                ),
                              }),
                            },
                          ]}
                        >
                          <Select
                            placeholder={t(
                              "pages:documentTemplates.create.fieldInformation.inputType"
                            )}
                            style={{ width: "100%" }}
                            ref={(ref) => {
                              elementRef.current[index] = ref; // took this from your guide's example.
                            }}
                            onChange={(value, options) =>
                              onChangeInputType(value, options, key, field)
                            }
                          >
                            {inputTypes.map((inputType) => (
                              <Select.Option key={inputType} value={inputType}>
                                {inputType}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      {needList[key]["needlist"] ? (
                        <>
                          <Col span={12}>
                            <Form.Item
                              labelCol={{ xs: 6 }}
                              labelAlign={"left"}
                              {...field}
                              name={[name, "list", "sourceType"]}
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
                                  <Select.Option
                                    key={listSourceType}
                                    value={listSourceType}
                                  >
                                    {listSourceType}
                                  </Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>

                          <Col span={12}>
                            <Form.Item
                              labelCol={{ xs: 6 }}
                              labelAlign={"left"}
                              {...field}
                              name={[name, "list", "source"]}
                              label={t(
                                "pages:documentTemplates.create.fieldInformation.source"
                              )}
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
                              {sourceType == "database" ? (
                                <Select>
                                  {tables.map((table) => (
                                    <Select.Option key={table} value={table}>
                                      {table}
                                    </Select.Option>
                                  ))}
                                </Select>
                              ) : (
                                <Input
                                  placeholder={t(
                                    "pages:documentTemplates.create.fieldInformation.source"
                                  )}
                                />
                              )}
                            </Form.Item>
                          </Col>
                        </>
                      ) : (
                        <></>
                      )}

                      <Col span={12}>
                        <Form.Item
                          labelCol={{ xs: 6 }}
                          labelAlign={"left"}
                          {...field}
                          name={[name, "position"]}
                          label={t(
                            "pages:documentTemplates.create.fieldInformation.position"
                          )}
                          rules={[
                            {
                              required: true,
                              message: t("messages:form.required", {
                                name: t(
                                  "pages:documentTemplates.create.fieldInformation.position"
                                ),
                              }),
                            },
                          ]}
                        >
                          <InputNumber
                            placeholder={t(
                              "pages:documentTemplates.create.fieldInformation.position"
                            )}
                            min={1}
                            max={1000}
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          labelCol={{ xs: 6 }}
                          labelAlign={"left"}
                          {...field}
                          name={[name, "groupTitle"]}
                          label={t(
                            "pages:documentTemplates.create.fieldInformation.groupTitle"
                          )}
                          rules={[
                            {
                              required: true,
                              message: t("messages:form.required", {
                                name: t(
                                  "pages:documentTemplates.create.fieldInformation.groupTitle"
                                ),
                              }),
                            },
                          ]}
                        >
                          <Input
                            placeholder={t(
                              "pages:documentTemplates.create.fieldInformation.groupTitle"
                            )}
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          labelCol={{ xs: 6 }}
                          label={t(
                            "pages:documentTemplates.create.fieldInformation.col"
                          )}
                          labelAlign="left"
                        >
                          <Form.Item
                            {...field}
                            key={String(field.key) + "xs"}
                            name={[name, "col", "xs"]}
                            style={{ display: "inline-block" }}
                          >
                            <InputNumber
                              placeholder={t(
                                "pages:documentTemplates.create.fieldInformation.xs"
                              )}
                              min={0}
                              max={1000}
                            />
                          </Form.Item>
                          <span
                            style={{
                              display: "inline-block",
                              width: "23px",
                              lineHeight: "32px",
                              textAlign: "center",
                            }}
                          ></span>
                          <Form.Item
                            {...field}
                            key={String(field.key) + "sm"}
                            name={[name, "col", "sm"]}
                            style={{ display: "inline-block" }}
                          >
                            <InputNumber
                              placeholder={t(
                                "pages:documentTemplates.create.fieldInformation.sm"
                              )}
                              min={0}
                              max={1000}
                            />
                          </Form.Item>
                          <span
                            style={{
                              display: "inline-block",
                              width: "23px",
                              lineHeight: "32px",
                              textAlign: "center",
                            }}
                          ></span>
                          <Form.Item
                            {...field}
                            key={String(field.key) + "lg"}
                            name={[name, "col", "lg"]}
                            style={{ display: "inline-block" }}
                          >
                            <InputNumber
                              placeholder={t(
                                "pages:documentTemplates.create.fieldInformation.lg"
                              )}
                              min={0}
                              max={1000}
                            />
                          </Form.Item>
                          <span
                            style={{
                              display: "inline-block",
                              width: "23px",
                              lineHeight: "32px",
                              textAlign: "center",
                            }}
                          ></span>
                          <Form.Item
                            {...field}
                            key={String(field.key) + "md"}
                            name={[name, "col", "md"]}
                            style={{ display: "inline-block" }}
                          >
                            <InputNumber
                              placeholder={t(
                                "pages:documentTemplates.create.fieldInformation.md"
                              )}
                              min={0}
                              max={1000}
                            />
                          </Form.Item>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          labelCol={{ xs: 6 }}
                          labelAlign={"left"}
                          {...field}
                          name={[name, "validations"]}
                          label={t(
                            "pages:documentTemplates.create.fieldInformation.validations"
                          )}
                          rules={[
                            {
                              required: true,
                              message: t("messages:form.required", {
                                name: t(
                                  "pages:documentTemplates.create.fieldInformation.validations"
                                ),
                              }),
                            },
                          ]}
                        >
                          <Select
                            placeholder={t(
                              "pages:documentTemplates.create.fieldInformation.validations"
                            )}
                            mode="multiple"
                            showArrow
                            tagRender={tagRender}
                            defaultValue={[]}
                            style={{ width: "100%" }}
                            options={validations}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                </div>
              );
            })}
            <Form.Item className="text-center">
              <Button
                type="dashed"
                onClick={() => {
                  setNeedList((prev) => [...prev, { needlist: false }]);
                  add({ needlist: false });
                }}
                icon={<PlusOutlined />}
                style={{ width: "100%" }}
              >
                Add field
              </Button>
            </Form.Item>
          </div>
        )}
      </Form.List>
    </>
  );
};

export default FieldDefinition;