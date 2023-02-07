import { Modal } from 'antd';
const { confirm } = Modal;

export const confirmDialog = async ({ title, content, onOk, onCancel, otherProps }: { title: string, content: any, onOk?: Function, onCancel?: Function, [x: string]: any }) => {
  title = title || "Title"
  content = content || "Content";

  const _onOk = () => {
    if (typeof onOk == "function") {
      onOk()
    }
  }

  const _onCancel = () => {
    if (typeof onCancel == "function") {
      onCancel()
    }
  }

  confirm({
    title: title,
    content: content,
    onOk: _onOk,
    onCancel: _onCancel,
    ...otherProps
  });
}
