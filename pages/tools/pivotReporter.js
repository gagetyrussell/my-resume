import router from 'umi/router';
import React from 'react';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import * as Papa from 'papaparse';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';
import TableRenderers from 'react-pivottable/TableRenderers';
import Plot from 'react-plotly.js';
import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers';

const { Dragger } = Upload;

const PlotlyRenderers = createPlotlyRenderers(Plot);

const divStyle = {
  overflowX: 'scroll'
};


class pivotReporter extends React.Component {
  constructor() {
    super();
    this.state = {
      csvfile: undefined,
      data: []
    };
    this.updateData = this.updateData.bind(this);
  }

  handleChange = event => {
    this.setState({
      csvfile: event.target.files[0]
    });
  };

  importCSV = () => {
    const { csvfile } = this.state;
    Papa.parse(csvfile, {
      complete: this.updateData,
      header: true
    });
  };

  updateData(result) {
    let data = result.data;
    console.log(result.data)
    this.setState({data: result.data});
  }

  render() {
    console.log(this.state.csvfile);
    return (
      <div style={divStyle}>
        <input
          className="csv-input"
          type="file"
          ref={input => {
            this.filesInput = input;
          }}
          name="file"
          placeholder={null}
          onChange={this.handleChange}
        />
        <p />
        <button onClick={this.importCSV}> Load Into Pivot</button>
        <PivotTableUI
            data={this.state.data}
            onChange={s => this.setState(s)}
            renderers={Object.assign({}, TableRenderers, PlotlyRenderers)}
            {...this.state}
        />
      </div>
    );
  }
}


export default pivotReporter;
