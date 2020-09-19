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

class PivotReporter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [] /* Array of Arrays e.g. [["a","b"],[1,2]] */,
    };
    this.handleFile = this.handleFile.bind(this);
  }
  handleFile(info /*:File*/) {
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
      this.setState({ data: result });
    };
    if (rABS) reader.readAsBinaryString(info.file.originFileObj);
    else reader.readAsArrayBuffer(info.file.originFileObj);
  }

  render() {
    return (
      <div>
        <div>
          <DataInput handleFile={this.handleFile} action={window.location.href}/>
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

export default PivotReporter;
