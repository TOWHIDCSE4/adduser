
import React, { useRef } from "react";
import Xlsx from './Xlsx'
import { CloudUploadOutlined } from "@ant-design/icons"
import { Button } from 'antd';
const SheetJSFT = [
  "xlsx", "xls"
].map(function (x) { return "." + x; }).join(",");

const ImportExcel = ({ getData, uploadTxt = "Upload File", setLoading }) => {
  const fileInput = useRef(null);
  const handleChange = async (e: any) => {
    console.time("upload")
    if(typeof setLoading === 'function') setLoading(true)
    const files = e.target.files;
    if (files && files[0]) {
      let data = await Xlsx.readFileFromInput(files[0]);
      if (Array.isArray(data)) {
        data = data.map(row => {
          return row.map(cell => cell ? String(cell) : cell);
        })
        data = data.filter(row => row.length !== 0);
      }
      if(typeof getData === 'function') getData(data);
    }
    console.timeEnd("upload")
  }
  return <>
    <Button
      style={{ marginBottom: 10 }}
      onClick={() => fileInput.current.click()}>
      <CloudUploadOutlined /> {uploadTxt}
    </Button>
    <input
      ref={fileInput}
      onClick={(e: any) => e.target.value = null}
      type="file"
      hidden
      accept={SheetJSFT}
      onChange={handleChange}
    />
  </>
}

export default ImportExcel;
