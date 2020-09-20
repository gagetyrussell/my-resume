import router from 'umi/router';
import React from 'react';
import { Typography, message } from 'antd';
import * as Papa from 'papaparse';
import styles from './pivotReporter.less';
import FileTable from '../../components/FileTable/index.js';
import plotly from 'plotly.js/dist/plotly';
import PlotlyEditor from 'react-chart-editor';
import 'react-chart-editor/lib/react-chart-editor.css';

const acceptMimes = ["text/csv", "application/vnd.ms-excel"]

const config = {editable: true};

class chartEditor extends React.Component {
  constructor() {
    super();
    this.state = {
      csvfile: undefined,
      filelist: [],
      datafields: [],
      dataSources: [],
      data: [],
      dataSourceOptions: [],
      layout: {},
      frames: [],
      filedata: [],
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

  updatePivotData(data, name) {
    let dataSources = {};
    data.map((d) => {
      Object.entries(d).map((e) => {
        if (!(e[0] in dataSources)) {
          dataSources[e[0]] = []
        }
        dataSources[e[0]] = [...dataSources[e[0]], e[1]]
      })
    });
    let dataSourceOptions = Object.keys(dataSources).map(name => ({
      value: name,
      label: name,
    }));
    this.setState({
      dataSources: dataSources,
      dataSourceOptions: dataSourceOptions,
      layout: {},
      data: [],
      frames: []
    }, () => {
      message.success(`${name} successfully loaded into Editor. Add a Trace!`);
    })
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
          <a href="javascript:;" onClick={() => this.updatePivotData(record.innerdata, record.filename)} style={{ marginRight: 8 }}>
            Load Editor
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
          <PlotlyEditor
            data={this.state.data}
            layout={this.state.layout}
            config={config}
            frames={this.state.frames}
            dataSources={this.state.dataSources}
            dataSourceOptions={this.state.dataSourceOptions}
            plotly={plotly}
            onUpdate={(data, layout, frames) =>
              this.setState({data, layout, frames})
            }
            useResizeHandler
            debug
            advancedTraceTypeSelector
          />
        </div>
      </div>
    );
  }
}


export default chartEditor;
