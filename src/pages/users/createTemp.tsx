import { SaveFilled } from "@ant-design/icons";
import UserDoneForm from "@root/src/components/Admin/Users/UserInformationForm";
import userTempsService from "@root/src/services/userTempService";
import useBaseHook from "@src/hooks/BaseHook";
import Layout from "@src/layouts/Login";
import { Button, Col, Form, Row } from "antd";
import to from "await-to-js";
import { useEffect, useState } from "react";
// import authService from "@root/src/services/authService";
// import getConfig from 'next/config';
// const { publicRuntimeConfig } = getConfig()

// const Layout = dynamic(() => import("@src/layouts/Admin"), { ssr: false });

const CreateTemp = () => {
  const { t, notify, redirect, router } = useBaseHook();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { query } = router;
  //submit form
  const onFinish = async (values: any): Promise<void> => {
    setLoading(true);
    console.log(values);
    // let { rePassword, ...otherValues } = values;
    // let [error, result]: any[] = await to(
    // 	userTempsService().withAuth().create(otherValues)
    // );
    // setLoading(false);
    // if (error) return notify(t(`errors:${error.code}`), "", "error");
    // notify(t("messages:message.recordUserCreated"));
    // redirect("frontend.admin.users.createTemp");
    // return result;
  };

  const randompass = () => {
    let result = "";
    let characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength = characters.length;
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
  const fetchData = async () => {
    let [userError, user]: any[] = await to(
      userTempsService().verifyToken({ data: query })
    );
    if (userError) {
      notify(t(`errors:${userError.code}`), "", "error");
      //   return redirect('frontend.admin.forgotPassword')
    }
    // setToken(query.token)
    console.log(user, "user");
    return user;
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="content-form">
        <div className="logo">
          {/* <div className="img">
          <img src={publicRuntimeConfig.LOGO}></img>
        </div> */}
          {/* <div className="sitename">{t('pages:forgotPassword.content')}</div> */}
        </div>
        <div className="form-registration" id="registration">
          <div className="content-form-login">
            <div className="sitename-title">Create a new account</div>
            <div className="sitename">
              Fill out the information to create a new account
            </div>
          </div>
          <Form
            form={form}
            name="createAdmin"
            layout="vertical"
            onFinish={onFinish}
            scrollToFirstError
          >
            <Row>
              <Col md={{ span: 16, offset: 4 }}>
                <UserDoneForm form={form} isEdit={false} />
                <Form.Item
                  wrapperCol={{ span: 24, offset: 10 }}
                  className="text-center"
                >
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="btn-margin-right"
                  >
                    <SaveFilled /> {t("buttons:submit")}
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </>
  );
};

CreateTemp.Layout = (props) => {
  const { t } = useBaseHook();
  return (
    <Layout
      title={t("pages:users.create.title")}
      description={t("pages:users.create.description")}
      {...props}
    />
  );
};

export default CreateTemp;
