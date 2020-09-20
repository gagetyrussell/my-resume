import { Table, Upload, Tooltip } from 'antd';
import React from 'react';
import styles from './index.less';

class DataInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let data = this.props.data;
    let outercolumns = this.props.outercolumns;
    const expandedRowRender = (record) => {
      return <Table columns={record.innercolumns} dataSource={record.innerdata} scroll={{ y: 240, x: '100%' }} pagination={false} className={styles.innerTable}/>;
    }
    return (
      <Table
        columns={outercolumns}
        expandable={{ expandedRowRender }}
        dataSource={data}
      />
    )
  }
}

export default FileTable;
