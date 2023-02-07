import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { LeftCircleFilled } from "@ant-design/icons";
import authService from "@src/services/authService";
import to from "await-to-js";
import useBaseHook from "@src/hooks/BaseHook";
import auth from "@src/helpers/auth";
import { Button, Form, Input, Row, Col } from "antd";
import QRCode from "qrcode";
const speakeasy = require("speakeasy");
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
import Cookies from 'universal-cookie';
const Layout = dynamic(() => import("@src/layouts/Login"), { ssr: false });

const Twofa = () => {
  const { t, notify, redirect,getCookies } = useBaseHook();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const canvasRef = useRef();
  const cookieObject = getCookies()
  const cookies = new Cookies(cookieObject)

  let user = auth().user;

  useEffect(() => {
    if (user.twofaKey) {
      let dataImage = speakeasy.otpauthURL({
        secret: user.twofaKey,
        label: `${publicRuntimeConfig.LABEL2FA || "App_platform"} - ${user.username}`,
      });
      QRCode.toCanvas(
        canvasRef.current,
        dataImage || " ",
        (error) => error && console.error(error)
      );
    }
  }, [user.twofaKey]);

  const onFinish = async (values: { tokenVerify: string }) => {
    let value = {
      tokenVerify: String(values.tokenVerify),
      code: user.code,
    };
    setLoading(true);
    let [error, result]: any[] = await to(
      authService().withAuth().AuthTwofa(value)
    );
    setLoading(false);
    if (error){
      notify(
          t("messages:message.loginFailed"),
          t(`errors:${error.code}`),
          "error"
      );
      if(error.data && error.data.redirect) {
        cookies.remove("token", {
          path: "/"
        })
        cookies.remove("user", {
          path: "/"
        })
        redirect("frontend.admin.documents.index");
      }
      return;
    }

    auth().setAuth(result);
    notify(t("messages:message.verify2FaSuccess"));
    redirect("frontend.admin.documents.index");
    return result;
  };

  return (
    <div className="content-form">
      {user && user.isFirst && user.twofaKey ? (
        <div className="logo">
          <div>
            <div>
              <div className="title">
                {t("pages:users.twofa.link.title")}
              </div>
              <div className="title">
                {t("pages:users.twofa.link.link")}
              </div>
              <div className="title">
                Android:{" "}
                <a
                  href={t("pages:users.twofa.link.android")}
                  className="title"
                >
                  Link here!
                </a>
              </div>
              <div className="title">
                Ios:{" "}
                <a
                  href={t("pages:users.twofa.link.ios")}
                  className="title"
                >
                  Link here!
                </a>
              </div>
            </div>
            <div className="title" style={{marginBottom:5}}>{t("pages:login.titleVerify")}</div>
            <canvas ref={canvasRef} />
          </div>
        </div>
      ) : (
        <div className="logo">
          <div className="img">
            <img src={publicRuntimeConfig.LOGO}></img>
          </div>
          <div className="sitename">Welcome! Please verify to your account.</div>
        </div>
      )}
      <div className='form-login'>
        <div className="content-form-login">
          <div className="sitename-title">Verify Google Authenticator!</div>
          <div className="sitename">Enter Code to continue to KDDI</div>
        </div>
        <Form
          onFinish={onFinish}
          form={form}
          name="tokenVerifyForm"
          layout="horizontal"
          initialValues={{
            tokenVerify: "",
          }}
        >
          <Col md={24} sm={24} xs={24}>
            <div style={{ marginBottom: 5, fontWeight: 600 }}>Code</div>
            <Form.Item
              name="tokenVerify"
              rules={[
                {
                  required: true,
                  message: t("messages:form.required", {
                    name: t("pages:login.tokenVerify"),
                  }),
                },
              ]}
            >
              <Input placeholder={t("pages:login.tokenVerify")} />
            </Form.Item>
          </Col>
          <Col md={24} sm={24} xs={24}>
            <Form.Item>
              <Row>
                <Col md={24} sm={24} xs={24}>
                  <Button
                    className="btn login"
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                  >
                    {t("buttons:verify")}
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </Col>
        </Form>
        <div style={{ textAlign: 'center', paddingTop: 20 }}>
          Wait, I mistyped my account...
          <a
            onClick={() => {
              auth().logout();
              redirect("frontend.admin.login");
            }}
            style={{ color: "#405189" }}
          >
            Click here
          </a>
        </div>
      </div>
    </div>
  );
};

Twofa.Layout = (props) => {
  const { t } = useBaseHook();
  return (
    <Layout
      title={t("pages:login.title")}
      description={t("pages:login.description")}
      {...props}
    />
  );
};

Twofa.permissions = {
  verifyTwofa: "R",
};

export default Twofa;
