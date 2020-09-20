import router from 'umi/router';
import React from 'react';
import { Typography, Upload, Tooltip, Button, message  } from 'antd';
import { DownloadOutlined, UploadOutlined, InboxOutlined, PlusOutlined   } from '@ant-design/icons';
import * as Papa from 'papaparse';
import styles from './viewer.less';
import FileTable from '../../components/FileTable/index.js';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';
import TableRenderers from 'react-pivottable/TableRenderers';
import Plot from 'react-plotly.js';
import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers';

const PlotlyRenderers = createPlotlyRenderers(Plot);

const acceptMimes = ["text/csv", "application/vnd.ms-excel"]

class viewer extends React.Component {
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
    this.onChange = this.onChange.bind(this);
  }

  handleChange = event => {
    let csvfile = event.target.files[0];
    this.setState({filelist: [...this.state.filelist, csvfile.name]});
    Papa.parse(csvfile, {
      complete: this.updateData,
      header: true
    });
  };

  handleFile(csvfile) {
    this.setState({filelist: [...this.state.filelist, csvfile.name]});
    Papa.parse(csvfile, {
      complete: this.updateData,
      header: true
    });
  }

  updateData(result) {
    let data = [result.data];
    let fields = result.meta.fields;
    this.setState({filedata: [...this.state.filedata, ...data], datafields: [...this.state.datafields, fields]}, () => {
      this.updateDataSource()
    });
  }

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
  }

  updatePivotData(data) {
    this.setState({data: data, rows: [], cols: []})
  }

  onChange(info) {
    if (info.file.status !== 'uploading') {
       let file = info.file.originFileObj;
       if (file) this.handleFile(info.file.originFileObj);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file parsed successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file parsing failed.`);
    }
  }

  beforeUpload(file) {
    if (! acceptMimes.includes(file.type)) {
      message.error(`${file.name} is not a png file`);
    }
    return acceptMimes.includes(file.type);
  }

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

    let progress = {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: percent => `${parseFloat(percent.toFixed(2))}%`,
    }

    return (
      <div>
        <Upload
          multiple={false}
          onChange={this.onChange}
          beforeUpload={this.beforeUpload}
          accept=".csv"
          className="avatar-uploader"
          action={window.location.href}
          progress={progress}>
          <Tooltip title="Your data is not uploaded anywhere, just parsed and stored in the browser session.">
            <Button icon={<UploadOutlined />}>Click to Select Data for Analysis</Button>
          </Tooltip>
        </Upload>
        <FileTable
          data={datasource}
          outercolumns={outercolumns}
        />
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


export default viewer;
