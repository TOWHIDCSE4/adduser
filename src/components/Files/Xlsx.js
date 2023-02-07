import XLSX from 'xlsx';
import _ from 'lodash'

export default class xlsxReader {
  static readFileFromInput = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const rABS = !!reader.readAsBinaryString;
      reader.onload = ({
        target: {
          result
        }
      }) => {
        const wb = XLSX.read(result, {
          type: rABS ? "binary" : "array",
          cellDates: true,
          dateNF: 'yyyy/mm/dd;@'
        });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, {
          header: 1
        });
        resolve(data)
      };
      reader.onabort = () => {
        reject()
        console.log('file reading was aborted');
      }
      reader.onerror = () => {
        reject()
        console.log('file reading has failed');
      }

      if (rABS) reader.readAsBinaryString(file);
      else reader.readAsArrayBuffer(file);
    })
  }

  static convertDataToXLSX = async ({ data, columns, sheetname = "Sheet1", filename = "default" }) => {
    let newData = await this.reformatData(data, columns)
    let ws = XLSX.utils.json_to_sheet(newData);
    let wb = XLSX.utils.book_new();
    var range = XLSX.utils.decode_range(ws['!ref']);
    for (var C = range.s.c; C <= range.e.c; ++C) {
      var address = XLSX.utils.encode_col(C) + "1"; // <-- first row, column number C
      if (!ws[address]) continue;
      let colObj = columns.find(column => column.dataIndex === ws[address].v)
      ws[address].v = _.get(colObj, 'title', '')
    }
    // width column
    let wscols = [];
    const header = Object.keys(newData[0]);
    for (var i = 0; i < header.length; i++) {
      wscols.push({ wch: header[i].length + 9 })
    }
    ws['!cols'] = wscols;
    // =====end-width-column====

    XLSX.utils.book_append_sheet(wb, ws, sheetname);
    // create file
    XLSX.writeFile(wb, `${filename}.xlsx`)
  }

  static reformatData = (data, columns) => {
    let filterColumns = []
    for (let column of columns) {
      if(!['action'].includes(column.key)) filterColumns.push(column)
    }
    let newData = []
    if(!data.length) data = [{}]
    for (let index in data) {
      let aData = data[index]
      let item = {}
      for(let column of filterColumns) {
        if(column.render && !column.ellipsis) {
          item[column.dataIndex] = column.render(aData[`${column.dataIndex}`], aData, index)
        }
        else item[column.dataIndex] = aData[column.dataIndex]
      }
      newData.push(item)
    }
    return newData
  }
}
