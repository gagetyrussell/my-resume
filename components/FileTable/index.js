import { Table, Upload, Tooltip, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React from 'react';
import styles from './index.less';

const acceptMimes = ["text/csv", "application/vnd.ms-excel"]

class FileTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onChange = this.onChange.bind(this);
  }

  beforeUpload(file) {
    if (! acceptMimes.includes(file.type)) {
      message.error(`${file.name} is not a png file`);
    }
    return acceptMimes.includes(file.type);
  };

  onChange(info) {
    if (info.file.status !== 'uploading') {
       let file = info.file.originFileObj;
       if (file) this.props.handleFile(info.file.originFileObj);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file parsed successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file parsing failed.`);
    }
  };

  render() {
    let data = this.props.data;
    let outercolumns = this.props.outercolumns;
    const expandedRowRender = (record) => {
      return <Table columns={record.innercolumns} dataSource={record.innerdata} scroll={{ y: 240, x: '100%' }} pagination={false} className={styles.innerTable}/>;
    }
    let dummyRequest = ({ file, onSuccess }) => {
      setTimeout(() => {
        onSuccess("ok");
      }, 0);
    };
    let progress = {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: percent => `${parseFloat(percent.toFixed(2))}%`,
    };
    return (
      <div>
        <Upload
          multiple={false}
          onChange={this.onChange}
          beforeUpload={this.beforeUpload}
          accept=".csv"
          className="avatar-uploader"
          customRequest={dummyRequest}
          progress={progress}>
          <Tooltip title="Your data is not uploaded anywhere, just parsed and stored in the browser session. Please use .csv format.">
            <Button icon={<UploadOutlined />}>Click to Select Data for Analysis</Button>
          </Tooltip>
        </Upload>
        <Table
          columns={outercolumns}
          expandable={{ expandedRowRender }}
          dataSource={data}
        />
      </div>
    )
  }
}

export default FileTable;
