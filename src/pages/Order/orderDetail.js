import React from "react";
import {Card, Descriptions, Typography, Table, Button} from "antd";
import {connect} from "dva";
import order from "@/models/order";

const { Title } = Typography;

@connect(({order})=>({
  orderDetail: order.orderDetail,
  isSuccess: order.isSuccess
}))
export default class OrderDetail extends React.Component{
  constructor() {
    super();
    this.state = {
      order: {}
    }
  }
  componentDidMount() {
    this.getDetail();
  }

  getDetail = ()=> {
    const orderId = this.props.history.location.query.orderId;
    const {dispatch} = this.props;
    dispatch({
      type: 'order/getOrderDetail',
      payload: {orderId}
    }).then(()=>{
      console.log(this.props.orderDetail);
      this.setState({
        order: this.props.orderDetail
      })
    })
  }

  btnFunction = (orderStatus,orderType)=> {
    let btn = '';
    if(orderType === 2) {
      //外送
      if(orderStatus === 0) {
        btn = '去配送';
      } else if(orderStatus === 2) {
        btn = '已送达';
      }
    } else {
      //自取
      if(orderStatus === 0) {
        btn = '完成';
      }
    }
    return btn;
  }

  updateStatus = ()=> {
    const {orderStatus, orderType} = this.state.order;
    let newStatus = 0;
    if(orderType === 2) {
      //外送
      if(orderStatus === 0) {
        newStatus = 2;
      } else if(orderStatus === 2) {
        newStatus = 1;
      }
    } else {
      //自取
      if(orderStatus === 0) {
        newStatus = 1;
      }
    }
    const {dispatch} = this.props;
    dispatch({
      type: 'order/updateStatus',
      payload: {
        orderId: this.state.order.orderId,
        orderStatus: newStatus
      }
    }).then(()=>{
      if(this.props.isSuccess) {
        this.getDetail();
      }
    })
  }

  render() {
    const {order} = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'number',
        key: 'number',
        align: 'center',
        render: (text,record,index) => <span>{index+1}</span>,
      },
      {
        title: '商品名称',
        dataIndex: 'productName',
        key: 'productName',
      },
      {
        title: '价格',
        dataIndex: 'productPrice',
        key: 'productPrice',
      },
      {
        title: '数量',
        dataIndex: 'productQuantity',
        key: 'productQuantity',
      },
      {
        title: '规格',
        dataIndex: 'productSpecification',
        key: 'productSpecification',
      },
    ];

    return (
      <Card>
        <Title level={4}>订单详情</Title>
        <div style={{textAlign: 'right'}}>
          {
            order.orderStatus !== 1?(
              <Button
                type="primary"
                style={{marginBottom: 20}}
                shape="round" size="large"
                onClick={this.updateStatus}
              >
                {this.btnFunction(order.orderStatus, order.orderType)}
              </Button>
            ):null
          }
        </div>
        <Descriptions title={order.orderId} bordered>
          <Descriptions.Item label="店铺编号">{order.shopId}</Descriptions.Item>
          <Descriptions.Item label="店铺名称">{order.shopName}</Descriptions.Item>
          <Descriptions.Item label="订单总金额">{order.orderAmount}</Descriptions.Item>
          <Descriptions.Item label="配送费">{order.shippingFee}</Descriptions.Item>
          <Descriptions.Item label="优惠金额">{order.discount}</Descriptions.Item>
          <Descriptions.Item label="实付金额">{order.actualPayment}</Descriptions.Item>
          <Descriptions.Item label="取单号">{order.code}</Descriptions.Item>
          <Descriptions.Item label="订单状态">{order.orderStatus===0?'待完成':`${order.orderStatus===1?'已完成':'配送中'}`}</Descriptions.Item>
          <Descriptions.Item label="下单时间">{order.createTime}</Descriptions.Item>
          <Descriptions.Item label="订单备注" span={3}>{order.remark}</Descriptions.Item>
          <Descriptions.Item label="买家信息" span={3}>
            {`${order.buyerName}(${order.gender==1?'先生':'女士'})`}<br/>
            电话：{order.buyerPhone}<br/>
            地址：{order.buyerAddress}
          </Descriptions.Item>
          <Descriptions.Item label="订单详情" span={3}>
            <Table dataSource={order.orderDetailList} columns={columns} style={{width: 1200}} pagination={false} bordered />
          </Descriptions.Item>
        </Descriptions>
      </Card>
    );
  }
}
