import React from 'react';
import XLSX from 'xlsx';
import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import DataInput from '../../components/DataInput/index.js';
import PlotlyEditor from 'react-chart-editor';
import 'react-chart-editor/lib/react-chart-editor.css';
import Plot from 'react-plotly.js';
import plotly from 'plotly.js/dist/plotly';
import styles from './viewer.less';

const config = {editable: true};

class Viewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datasource: [] /* Array of Arrays e.g. [["a","b"],[1,2]] */,
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
          console.log(row)
          row.forEach(function(cellValue, cellIndex) {
              jsonRow[headers[cellIndex]] = cellValue;
          });
          return jsonRow;
      });
      /* Update state */
      this.setState({ datasource: result });
    };
    if (rABS) reader.readAsBinaryString(info.file.originFileObj);
    else reader.readAsArrayBuffer(info.file.originFileObj);
  }

  render() {
    console.log(this.state.datasource)
    return (
      <div>
        <div>
          <DataInput handleFile={this.handleFile} action={window.location.href}/>
        </div>
        <div>
          <PlotlyEditor
            dataSources={this.state.datasource}
            layout={this.state.layout}
            config={config}
            frames={this.state.frames}
            plotly={plotly}
            onUpdate={(data, layout, frames) => this.setState({data, layout, frames})}
            useResizeHandler
            debug
            advancedTraceTypeSelector
          />
        </div>
      </div>
    );
  }
}

export default Viewer;
