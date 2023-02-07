import React, { useEffect, useState } from "react";
import { Modal, Form, Button } from "antd";
import useBaseHook from "@src/hooks/BaseHook";
import UserForm from '@src/components/Admin/Users/UserForm';
import userService from '@root/src/services/userService';
import to from 'await-to-js'

interface ModelFormProps {
  onUpdateUser: any;
  onCancel: () => void;
  visible: boolean;
}

const InfoUser = ({ onUpdateUser, visible, onCancel }: ModelFormProps) => {
  const { t, notify } = useBaseHook();
  const [form] = Form.useForm();
  const [admin, setAdmin]: any[] = useState<User>();
  const [state, setChangeState] = useState(false);
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    let [adminError, User]: [any, User] = await to(userService().withAuth().getInfo());
    if (adminError) return notify(t(`errors:${adminError.code}`), '', 'error')
    setAdmin(User)
  }
  
  const changeState2Fa = async () => {
    setLoading(true)
    let [adminError, User]: [any, User] = await to(userService().withAuth().changeState2FA());
    if (adminError) return notify(t(`errors:${adminError.code}`), '', 'error')
    notify("Change state 2FA success");
    setChangeState(!state)
    setLoading(false)
  }


  useEffect(() => {
    fetchData()
  }, [visible])

  useEffect(() => {
    fetchData()
  }, [state])

  if (!admin) return <></>

  return (
    <Form
      form={form}
      name="formUpdateUser"
      initialValues={{
        ...admin,
      }}
      layout="vertical"
      onFinish={onUpdateUser}
    >
      <Modal
        closable={false}
        open={visible}
        title={t("pages:infoUser.title")}
        onCancel={onCancel}
        onOk={() => { form.submit() }}
        footer={[
          <Button key="back" type="primary" danger={admin.twofa? true:false} loading={loading}  onClick={changeState2Fa}>
            {admin.twofa ? t("pages:infoUser.disable2FA") : t("pages:infoUser.enable2FA")}
          </Button>,
          <Button
            type="primary"
            onClick={onCancel}
          >
            Cancel
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={() => { form.submit() }}>
            Submit
          </Button>,
        ]}
      >
        <UserForm form={form} isEdit={true} isTenant={true} />
      </Modal>
    </Form>
  );
};

export default InfoUser;
