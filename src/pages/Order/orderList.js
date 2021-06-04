import React from "react";
import {Button, Card, Col, Form, Input, Row, Select, Typography, DatePicker, Table} from "antd";
import moment from 'moment';
import styles from "@/assets/common.less";
import {router} from "umi";
import {connect} from "dva";

const {Option} = Select;
const { Title } = Typography;
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';

@connect(({order})=>({
  orderPage: order.orderPage,
}))
@Form.create()
export default class OrderList extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      searchConditions: {
        page: 1,
        size: 10,
        orderId: '',
        startTime: '2021-05-01',
        endTime: '2021-06-21',
        orderStatus: -1
      },
      currentPage: 1,
      total: 0,
    }
  }
  componentDidMount() {
    this.getOrderPage();
  }

  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log(values);
      values.startTime = values.date[0].format("yyyy-MM-DD");
      values.endTime = values.date[1].format("yyyy-MM-DD");
      delete values.date;
      this.setState({
        searchConditions: {...this.state.searchConditions,...values}
      },()=>{
        this.getOrderPage();
      })
    });
  };
  handleReset = () => {
    this.props.form.resetFields();
  };
  orderDetail = (record)=> {
    router.push('/order/orderDetail?orderId=' + record.orderId);
  }
  getOrderPage = ()=> {
    const {dispatch} = this.props;
    dispatch({
      type: 'order/getOrderPage',
      payload: {
        ...this.state.searchConditions,
        page: this.state.currentPage,
      }
    }).then(()=>{
      const orderPage = this.props.orderPage;
      this.setState({
        dataSource: orderPage.data,
        currentPage: orderPage.page,
        total: orderPage.total
      })
    })
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
        dataIndex: 'orderId',
        key: 'orderId',
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
        dataIndex: 'orderType',
        key: 'orderType',
        align: 'center',
        render: (text, record) => (record.orderType==1?'自取':'外卖')
      },
      {
        title: '订单状态',
        dataIndex: 'orderStatus',
        key: 'orderStatus',
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
                  {getFieldDecorator('orderId',{initialValue: ''})(
                    <Input />
                  )}
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item label='下单日期'>
                  {getFieldDecorator('date',{initialValue: null})(
                    <RangePicker
                      // defaultValue={[moment('2015/01/01', dateFormat), moment('2015/01/01', dateFormat)]}
                      format={dateFormat}
                    />
                  )}
                </Form.Item>
              </Col>
              {/*<Col span={3}>
                <Form.Item label='订单类型'>
                  {getFieldDecorator('orderType',{initialValue: -1})(
                    <Select style={{ width: 80 }}>
                      <Option value={-1}>全部</Option>
                      <Option value={1}>自取</Option>
                      <Option value={2}>外送</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>*/}
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
