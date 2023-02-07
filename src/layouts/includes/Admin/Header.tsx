import React, { useState } from "react";
import Avatar from "react-avatar";
import { Menu, Layout, Button } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined, SettingOutlined, UserSwitchOutlined,BellOutlined,UserOutlined } from "@ant-design/icons";
import to from "await-to-js";
import useBaseHook from "@src/hooks/BaseHook";
import auth from "@src/helpers/auth";
import ChangePassword from "@src/components/GeneralComponents/ChangePassword";
import InfoUser from "@src/components/GeneralComponents/InfoUser";
import { confirmDialog } from "@src/helpers/dialogs";
import authService from "@root/src/services/authService";
import userService from '@root/src/services/userService';

const { Header } = Layout;
const { SubMenu } = Menu;

const AdminHeader = (props: any) => {
  const { t, notify, redirect, getData, router } = useBaseHook();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showUser, setshowUser] = useState(false);
  let user = auth().user

  const renderRightContent = () => {
    const firstName = getData(auth(), "user.firstName", "User");
    const username = getData(auth(), "user.username", "User");
    return (
      <>
        <Menu key="user" mode="horizontal">
          <SubMenu
            key="name"
            title={
              <>
                <span className="crop-name">
                  {" "}
                  {t("common:hi", { username: firstName })}{" "}
                </span>
                <Avatar
                  style={{ marginLeft: 8 }}
                  size="32"
                  name={firstName}
                  round={true}
                />
              </>
            }
          >
            <Menu.Item key="change-password">
              <Button
                onClick={() => {
                  setShowChangePassword(true);
                }}
                type="link"
              >
                {t("buttons:changePassword")} <SettingOutlined />
              </Button>
            </Menu.Item>
            <Menu.Item key="Info-user">
              <Button
                onClick={() => {
                  setshowUser(true);
                }}
                type="link"
              >
                {t("buttons:info_user")} <UserOutlined />
              </Button>
            </Menu.Item>
            <Menu.Item key="signout">
              <Button
                type="link"
                onClick={() => {
                  confirmDialog({
                    onOk: () => {
                      authService().withAuth().logout({ username });
                      redirect("frontend.admin.login");
                    },
                    title: t("buttons:signout"),
                    content: t("messages:message.signoutConfirm"),
                    okText: "Đồng ý",
                    cancelText: "Hủy",
                  });
                }}
              >
                {t("buttons:signout")} <UserSwitchOutlined />
              </Button>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </>
    );
  };


  const onChangePassword = async (data: any): Promise<void> => {
    setShowChangePassword(false);
    let password = data.password;
    let [error, result]: [any, any] = await to(
      authService().withAuth().changePassword({ password })
    );
    if (error) return notify(t(`errors:${error.code}`), "", "error");
    notify(t("messages:message.recordUpdated"));
    return result;
  };

  const renderPasswordDialog = () => {
    return (
      <ChangePassword
        onChangePassword={onChangePassword}
        visible={showChangePassword}
        onCancel={() => {
          setShowChangePassword(false);
        }}
      />
    );
  };

  const onUpdateUser = async (data: any): Promise<void> => {
    let [error, result]: any[] = await to(userService().withAuth().edit({
      id: user.id,
      ...data
    }));
    if (error) return notify(t(`errors:${error.code}`), '', 'error')
    notify(t("messages:message.recordUserUpdated"))
    setshowUser(false)
    return result
  };

  const renderInfoUserDialog = () => {
    return (
      <InfoUser
        onUpdateUser={onUpdateUser}
        visible={showUser}
        onCancel={() => {
          setshowUser(false);
        }}
      />
    );
  };

  

  const { collapsed, onCollapseChange } = props;
  const menuIconProps = {
    className: "trigger",
    onClick: () => onCollapseChange(!collapsed),
  };

  let headerClass = "header";
  if (collapsed) headerClass += " collapsed";

  return (
    <React.Fragment>
      <Header className={headerClass}>
        {collapsed ? (
          <MenuUnfoldOutlined {...menuIconProps} />
        ) : (
          <MenuFoldOutlined {...menuIconProps} />
        )}
        <div className="right-container">{renderRightContent()}</div>
      </Header>
      {renderPasswordDialog()}
      {renderInfoUserDialog()}
    </React.Fragment>
  );
};

export default AdminHeader;
