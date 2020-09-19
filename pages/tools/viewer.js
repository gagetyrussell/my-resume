import router from 'umi/router';
import React from 'react';
import { Table } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import * as Papa from 'papaparse';
import styles from './viewer.less';

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
];

class viewer extends React.Component {
  constructor() {
    super();
    this.state = {
      csvfile: undefined,
      data: [],
      filelist: [],
      datafields: [],
      datasource: []
    };
    this.updateData = this.updateData.bind(this);
  }

  handleChange = event => {
    let csvfile = event.target.files[0];
    this.setState({filelist: [...this.state.filelist, csvfile.name]});
    Papa.parse(csvfile, {
      complete: this.updateData,
      header: true
    });
  };

  updateData(result) {
    let data = [result.data];
    let fields = result.meta.fields;
    this.setState({data: [...this.state.data, ...data], datafields: [...this.state.datafields, fields]}, () => {
      this.updateDataSource()
    });
  }

  updateDataSource() {
    let fields = this.state.datafields;
    let data = this.state.data;
    let filelist = this.state.filelist;

    let datasource = []
    filelist.map((filename, i) => {
      let row = {
        key: i + 1,
        filename: filename,
        length: data[i].length,
        width: fields[i].length
      };
      datasource.push(row)
    })
    this.setState({ datasource })
  }

  render() {
    let fields = this.state.datafields;
    let data = this.state.data;
    let filelist = this.state.filelist;
    let datasource = this.state.datasource;
    console.log('source', datasource)

    return (
      <div>
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
        <Table
          className={styles.fileTable}
          dataSource={datasource}
          columns={outercolumns}>
        </Table>
      </div>
    );
  }
}


export default viewer;
