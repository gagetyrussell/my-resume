import { Table } from 'antd';
import React from 'react';
import styles from './index.less';

// const columns = [
//   { title: 'Name', dataIndex: 'name', key: 'name' },
//   { title: 'Age', dataIndex: 'age', key: 'age' },
//   { title: 'Address', dataIndex: 'address', key: 'address' },
//   {
//     title: 'Action',
//     dataIndex: '',
//     key: 'x',
//     render: () => <a>Delete</a>,
//   },
// ];
//
// const data = [
//   {
//     key: 1,
//     name: 'John Brown',
//     age: 32,
//     address: 'New York No. 1 Lake Park',
//     description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
//   },
//   {
//     key: 2,
//     name: 'Jim Green',
//     age: 42,
//     address: 'London No. 1 Lake Park',
//     description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.',
//   },
//   {
//     key: 3,
//     name: 'Not Expandable',
//     age: 29,
//     address: 'Jiangsu No. 1 Lake Park',
//     description: 'This not expandable',
//   },
//   {
//     key: 4,
//     name: 'Joe Black',
//     age: 32,
//     address: 'Sidney No. 1 Lake Park',
//     description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.',
//   },
// ];

class FileTable extends React.Component {
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
