import { useState } from "react";
function showModal() {
  const [visible, setVisible] = useState(false);
  function toggle() {
    setVisible(!visible);
  }
  return {
    visible,
    toggle,
  };
}

export default showModal;
