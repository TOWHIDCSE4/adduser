import React, { useState, useEffect } from "react";
import { Form, Button, Select, Checkbox, Table, Row, Col, Card } from "antd";
import { LeftCircleFilled, SaveFilled } from "@ant-design/icons";
import useBaseHook from "@src/hooks/BaseHook";
import roleGroup from "@root/src/services/roleService";
import permissionService from "@src/services/permissionService";
import rolePermissionService from "@src/services/rolePermissionService";
import useSWR from "swr";
import to from "await-to-js";

const { Option } = Select;

const PermistionForm = ({ onFinish,dataPer,loading }: { onFinish: any,dataPer?:any,loading:boolean }) => {
  console.log("dataPer",dataPer)
  const { t, getData, router, notify } = useBaseHook();
  const { query } = router;
  let result: any = {};

  const renderCheckbox = (row: any, permission: number) => {
    const onChange = (e: any) => {
      e.target.checked
        ? (row.currentValue += permission)
        : (row.currentValue -= permission);
      result[row.key] = row.currentValue;
    };

    const checked = (row.currentValue & permission) === permission;
    let disabled = (row.value & permission) !== permission;
    if (disabled) return <div></div>;
    return <Checkbox defaultChecked={checked} onChange={onChange}></Checkbox>;
  };

  const renderPermissionCategory = (category: any) => {
    return (
      <Row key={category.name} gutter={[16, 24]}> 
        {category.permissions.map((Per,index) => {
          return (
            <Col key={index} span={6}>
              <Card title={Per.name}>
                {(Per.value & 8) == 8 && (
                  <Row>
                    <Col span={12}>{t("buttons:create")}</Col>
                    <Col span={12} style={{textAlign: "right"}}>
                      {renderCheckbox(Per, 8)}
                    </Col>
                  </Row>
                )}
                {(Per.value & 4) == 4 && (
                  <Row>
                    <Col span={12}>{t("buttons:view")}</Col>
                    <Col span={12} style={{textAlign: "right"}}>{renderCheckbox(Per, 4)}</Col>
                  </Row>
                )}
                {(Per.value & 2) == 2 && (
                  <Row>
                    <Col span={12}>{t("buttons:edit")}</Col>
                    <Col span={12} style={{textAlign: "right"}}>{renderCheckbox(Per, 2)}</Col>
                  </Row>
                )}
                {(Per.value & 1) == 1 && (
                  <Row>
                    <Col span={12}>{t("buttons:delete")}</Col>
                    <Col span={12} style={{textAlign: "right"}}>{renderCheckbox(Per, 1)}</Col>
                  </Row>
                )}
                {(Per.value & 16) == 16 && (
                  <Row>
                    <Col span={12}>{t("buttons:approve_reject")}</Col>
                    <Col span={12} style={{textAlign: "right"}}>{renderCheckbox(Per, 16)}</Col>
                  </Row>
                )}
              </Card>
            </Col>
          );
        })}
      </Row>
    );
  };

  if (!dataPer.permissions.length) return <></>;

  return (
    <Card title='Permissions'>
      {dataPer.permissions.map((g: any) => renderPermissionCategory(g))}
      <br/>
      <div className="text-center">
      <Button onClick={() => router.back()} className="btn-margin-right">
        <LeftCircleFilled /> {t("buttons:back")}
      </Button>
      <Button
        type="primary"
        onClick={() => onFinish(result)}
        loading={loading}
        className="btn-margin-right"
      >
        <SaveFilled /> {t("buttons:submit")}
      </Button>
      </div>
    </Card>
  );
};

export default PermistionForm;
