import React from "react";
import {Button, Card, Col, Form, Input, Row, Select, Typography, DatePicker, Table} from "antd";
import moment from 'moment';
import styles from "@/assets/common.less";
import {router} from "umi";

const {Option} = Select;
const { Title } = Typography;
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';

@Form.create()
export default class OrderList extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [
        {
          key: 1,
          id: 20210419172466845,
          buyerName: '张三',
          orderAmount: 34,
          type: 1,
          orderStatus: 0,
          createTime: '2021-04-19 16:33:55'
        },
        {
          key: 2,
          id: 20210419172466845,
          buyerName: '张三',
          orderAmount: 34,
          type: 1,
          orderStatus: 1,
          createTime: '2021-04-19 14:15:36'
        },
        {
          key: 3,
          id: 20210419172466845,
          buyerName: '张三',
          orderAmount: 34,
          type: 2,
          orderStatus: 2,
          createTime: '2021-04-19 12:23:14'
        },
      ],
    }
  }
  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.setState({
        searchConditions: {...this.state.searchConditions,...values}
      },()=>{
        this.getList();
      })
    });
  };
  handleReset = () => {
    this.props.form.resetFields();
  };
  orderDetail = ()=> {
    router.push('/order/orderDetail');
  }
  render() {
    const {getFieldDecorator} = this.props.form;
    const {dataSource} = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'number',
        key: 'number',
        align: 'center',
        render: (text,record,index) => <span>{index+1}</span>,
      },
      {
        title: '订单编号',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '买家姓名',
        dataIndex: 'buyerName',
        key: 'buyerName',
      },
      {
        title: '订单金额',
        dataIndex: 'orderAmount',
        key: 'orderAmount',
        align: 'center',
      },
      {
        title: '订单类型',
        dataIndex: 'type',
        key: 'type',
        align: 'center',
        render: (text, record) => (record.type==1?'自取':'外卖')
      },
      {
        title: '订单状态',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        render: (text, record) => {
          switch (record.orderStatus) {
            case 0: return '待完成';
            case 1: return '已完成';
            case 2: return '配送中';
          }
        }
      },
      {
        title: '下单时间',
        dataIndex: 'createTime',
        key: 'createTime',
        align: 'center',
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        render: (text, record) => (
          <span>
        <Button size="small" onClick={()=>this.orderDetail(record)}>详情</Button>
      </span>
        ),
      },
    ];
    return (
      <Card>
        <Title level={4}>订单管理</Title>
        <div className={styles.search}>
          <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
            <Row gutter={20}>
              <Col span={6}>
                <Form.Item label='订单编号'>
                  {getFieldDecorator('id',{initialValue: ''})(
                    <Input />
                  )}
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item label='下单日期'>
                  {getFieldDecorator('name',{initialValue: null})(
                    <RangePicker
                      // defaultValue={[moment('2015/01/01', dateFormat), moment('2015/01/01', dateFormat)]}
                      format={dateFormat}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item label='订单类型'>
                  {getFieldDecorator('type',{initialValue: -1})(
                    <Select style={{ width: 80 }}>
                      <Option value={-1}>全部</Option>
                      <Option value={1}>自取</Option>
                      <Option value={2}>外送</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item label='订单状态'>
                  {getFieldDecorator('orderStatus',{initialValue: -1})(
                    <Select style={{ width: 80 }}>
                      <Option value={-1}>全部</Option>
                      <Option value={0}>待完成</Option>
                      <Option value={1}>已完成</Option>
                      <Option value={2}>配送中</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={3}>
                <Button type="primary" htmlType="submit">搜索</Button>
                <Button type="default" htmlType="reset" style={{ marginLeft: 8}} onClick={this.handleReset}>清空</Button>
              </Col>
            </Row>
          </Form>
        </div>
        <div className={styles.table}>
          <Table columns={columns} dataSource={dataSource} />
        </div>
      </Card>
    );
  }
}
