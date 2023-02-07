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
import FieldDefinition from "@root/src/components/Admin/Application/FieldOfGroup/FieldDefinition/FieldDefinition";

const GroupFieldDefinition = ({formValue,nameGroup}) => {
  const { t } = useBaseHook();

  return (
    <>
      <Form.List name={[nameGroup, "FieldDefinition"]}>
        {(fields, { add, remove }) => (
          <div onClick={(e) => e.stopPropagation()}>
            {fields.map((field, index, fullarr) => {
              let { key, name, ...restField } = field;
              return (
                <div key={String(key) +'FieldDefinition'}>
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
                    <FieldDefinition nameGroup={name} keyGroup={key} />
                  </Card>
                </div>
              );
            })}
            <Form.Item className="text-center">
              <Button
                type="dashed"
                onClick={() => {
                  add();
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

export default GroupFieldDefinition;