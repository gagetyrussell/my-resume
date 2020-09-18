import React from 'react';
import XLSX from 'xlsx';
import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import DataInput from '../../components/DataInput/index.js';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';
import TableRenderers from 'react-pivottable/TableRenderers';
import Plot from 'react-plotly.js';
import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers';
import styles from './pivotReporter.less';

const PlotlyRenderers = createPlotlyRenderers(Plot);

class SheetJSApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [] /* Array of Arrays e.g. [["a","b"],[1,2]] */,
    };
    this.handleFile = this.handleFile.bind(this);
    this.exportFile = this.exportFile.bind(this);
  }
  handleFile(file /*:File*/) {
    /* Boilerplate to set up FileReader */
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onload = (e) => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? "binary" : "array" });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      const headers = data.shift();
      const result = data.map(function(row) {
          var jsonRow = {};
          row.forEach(function(cellValue, cellIndex) {
              jsonRow[headers[cellIndex]] = cellValue;
          });
          return jsonRow;
      });
      /* Update state */
      this.setState({ data: result, cols: headers });
    };
    if (rABS) reader.readAsBinaryString(file);
    else reader.readAsArrayBuffer(file);
  }
  exportFile() {
    /* convert state to workbook */
    const ws = XLSX.utils.aoa_to_sheet(this.state.data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
    /* generate XLSX file and send to client */
    XLSX.writeFile(wb, "sheetjs.xlsx");
  }
  render() {
    console.log(this.state.data)
    return (
      <div>
        <div>
          <DataInput handleFile={this.handleFile} />
        </div>
        <div className={styles.pivotTable}>
          <PivotTableUI
              data={this.state.data}
              cols={[]}
              rows={[]}
              onChange={s => this.setState(s)}
              renderers={Object.assign({}, TableRenderers, PlotlyRenderers)}
          />
        </div>
      </div>
    );
  }
}

export default SheetJSApp;
