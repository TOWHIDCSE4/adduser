import useBaseHook from "@src/hooks/BaseHook";
import { Result, Button } from "antd";

const Error = ({permission, requirePermission, userPermission}: { permission?: string; requirePermission?: string; userPermission?: string}) => {
  const { t, router } = useBaseHook();
  let subTitle;
  if (permission) {
    subTitle = t("pages:errors.403.permissionDetail", {
      permission,
      requirePermission,
      userPermission,
    });
  }
  return (
    <Result
      status={403}
      title={t("pages:errors.403.title")}
      subTitle={
        <div>
          {t("pages:errors.403.description")}
          <br />
          {subTitle}
        </div>
      }
      extra={
        <Button type="primary" onClick={() => router.back()}>
          {t("buttons:back")}
        </Button>
      }
    />
  );
};

export default Error;
