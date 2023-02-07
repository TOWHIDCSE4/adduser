import Excel from 'exceljs';
import fs from 'fs'

class XLSXReader {
  static convertDataToXLSX = async ({ data, columns, path = "./tmp/excel", fileName = "example", buildItemFn = null }) => {
    let pathFile = `${path}/${fileName}.xlsx`
    if (!fs.existsSync(pathFile)) {
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
      }
      const options = {
        filename: pathFile,
        useStyles: true,
        useSharedStrings: false
      };

      const workbook = new Excel.stream.xlsx.WorkbookWriter(options);
      for(let index in data) {
        let dataT = data[index]
        const worksheet = workbook.addWorksheet(`Sheet${Number(index) + 1}`);
        worksheet.columns = columns
        if(!dataT.length) worksheet.addRow({}).commit();
        for (let item of dataT) {
          if (buildItemFn) {
            item = buildItemFn(item);
          }
          worksheet.addRow(item).commit();
        }
      }

      return workbook.commit().then(function() {
        console.log('excel file cretaed');
      });
    }
    return;
  }
}

export default XLSXReader
