import React, { useState } from "react";
import {
  Form,
  Input,
  Card,
  Button,
} from "antd";
import useBaseHook from "@src/hooks/BaseHook";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import GroupFieldDefinition from "@root/src/components/Admin/Application/FieldOfGroup/GroupFieldDefinition";


const GroupDefinition = ({ formValue }) => {
  const { t } = useBaseHook();
  return (
    <>
     <Form.List name="createDocumentTemplates">
      {(fields, { add, remove }) => (
        <div onClick={(e) => e.stopPropagation()}>
        {fields.map((field, index, fullarr) => 
          {
            let { key, name, ...restField } = field;
            return (
              <Card
                  key={key}
                  title={  
                    <Form.Item
                      style={{ marginBottom: 0}}
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
                        style={{ width: "95%" }}
                      />
                    </Form.Item>
                  }
                  style={{ width: "100%", marginBottom: "50px" }}
                  extra={
                    <MinusCircleOutlined
                      className="remove"
                      onClick={() => remove(name)}
                    />
                  }
                >
                <GroupFieldDefinition formValue={formValue} nameGroup={name}/>
              </Card>
            );
          }
        )}
          <Form.Item className="text-center">
            <Button
              type="dashed"
              onClick={() => {
                add();
              }}
              icon={<PlusOutlined />}
              style={{ width: "70%" }}
            >
              Add field
            </Button>
          </Form.Item>
        </div>
      )}
     </Form.List>
    </>
  )
};

export default GroupDefinition;