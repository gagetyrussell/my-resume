import router from 'umi/router';
import React from 'react';
import { Typography } from 'antd';
import * as Papa from 'papaparse';
import styles from './pivotReporter.less';
import FileTable from '../../components/FileTable/index.js';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';
import TableRenderers from 'react-pivottable/TableRenderers';
import Plot from 'react-plotly.js';
import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers';

const PlotlyRenderers = createPlotlyRenderers(Plot);

const acceptMimes = ["text/csv", "application/vnd.ms-excel"]

class pivotReporter extends React.Component {
  constructor() {
    super();
    this.state = {
      csvfile: undefined,
      filelist: [],
      datafields: [],
      datasource: [],
      data: [],
      filedata: [],
      rows: [],
      cols: []
    };
    this.updateData = this.updateData.bind(this);
    this.handleFile = this.handleFile.bind(this);
  };

  handleFile(csvfile) {
    this.setState({filelist: [...this.state.filelist, csvfile.name]});
    Papa.parse(csvfile, {
      complete: this.updateData,
      header: true,
      skipEmptyLines: true
    });
  };

  updateData(result) {
    let data = [result.data];
    let fields = result.meta.fields;
    this.setState({filedata: [...this.state.filedata, ...data], datafields: [...this.state.datafields, fields]}, () => {
      this.updateDataSource()
    });
  };

  updateDataSource() {
    let fields = this.state.datafields;
    let data = this.state.filedata;
    let filelist = this.state.filelist;

    let datasource = []
    filelist.map((filename, i) => {
      let innerdata = data.map((d, i) => {
        d['key'] = i
        return d
      });
      let innercolumns = fields.map((d, i) => {
        let innerfields = d.map((f,i) => {
          return (
            {
              title: f,
              dataIndex: f,
              key: f,
              render: (f) => (
                <Typography.Text style={{ fontSize: 10 }}>
                  {f}
                </Typography.Text>
              )
            }
          )
        })
        return innerfields
      });
      let row = {
        key: i + 1,
        filename: filename,
        length: data[i].length,
        width: fields[i].length,
        innercolumns: innercolumns[i],
        innerdata: innerdata[i]
      };
      datasource.push(row)
    })
    this.setState({ datasource })
  };

  updatePivotData(data) {
    this.setState({data: data, rows: [], cols: []})
  };

  render() {
    let fields = this.state.datafields;
    let filedata = this.state.filedata;
    let filelist = this.state.filelist;
    let datasource = this.state.datasource;
    const outercolumns = [
      {
        title: 'filename',
        dataIndex: 'filename',
        key: 'filename',
      },
      {
        title: 'Length',
        dataIndex: 'length',
        key: 'length',
      },
      {
        title: 'Width',
        dataIndex: 'width',
        key: 'width',
      },
      {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        render: (record) => (
          <a href="javascript:;" onClick={() => this.updatePivotData(record.innerdata)} style={{ marginRight: 8 }}>
            Load Pivot
          </a>
        )
      },
    ];

    return (
      <div>
        <FileTable
          handleFile={this.handleFile}
          data={datasource}
          outercolumns={outercolumns}
        />
        <div className={styles.contentDiv}>
          <PivotTableUI
              data={this.state.data}
              onChange={s => this.setState(s)}
              renderers={Object.assign({}, TableRenderers, PlotlyRenderers)}
              {...this.state}
          />
        </div>
      </div>
    );
  }
}


export default pivotReporter;
