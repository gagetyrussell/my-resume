import React from 'react';
import { Button, Upload, message } from 'antd';
import { DownloadOutlined, UploadOutlined, InboxOutlined, PlusOutlined   } from '@ant-design/icons';
import styles from './index.less';
import { Tooltip } from 'antd';


//const { Dragger } = Upload;

/* list of supported file types */
const SheetJSFT = [
  "xlsx",
  "xlsb",
  "xlsm",
  "xls",
  "xml",
  "csv",
  "txt",
  "ods",
  "fods",
  "uos",
  "sylk",
  "dif",
  "dbf",
  "prn",
  "qpw",
  "123",
  "wb*",
  "wq*",
  "html",
  "htm"
]  .map(function (x) {
    return "." + x;
  })
  .join(",");

class DataInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    }
    this.onChange = this.onChange.bind(this);
  }

  onChange(info) {
    if (info.file.status !== 'uploading') {
       let file = info.file.originFileObj;
       if (file) this.props.handleFile(file);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file parsed successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file parsing failed.`);
    }
  }
  render() {
    let { loading } = this.state;
    let progress = {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: percent => `${parseFloat(percent.toFixed(2))}%`,
    }
    return (

      <Upload
        multiple={false}
        onChange={this.onChange}
        className="avatar-uploader"
        progress={progress}>
        <Tooltip title="Your data is not uploaded anywhere, just parsed and stored in the browser session.">
          <Button icon={<UploadOutlined />}>Click to Select Data for Analysis</Button>
        </Tooltip>
      </Upload>

    );
  }
}

export default DataInput
