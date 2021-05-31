import React from "react";
import {Card, Descriptions, Typography, Table, Button} from "antd";

const { Title } = Typography;

export default class OrderDetail extends React.Component{
  constructor() {
    super();
    this.state = {
      order: {
        id: 'shine12545',
        orderType: 2,   //1自取  2外卖
        shopId: 3348,
        shopName: '闲茶成信大店',
        totalPrice: 54,
        shippingFee: 5,   //配送费
        discount: 5,
        actualPrice: 54,
        code: 37,   //取单号
        orderStatus: 0,  //0未完成订单（当前订单）  1已完成订单（历史订单）  2配送中
        createTime: '2021-03-18 14:00:06',
        remark: '放到门口',  //备注
        addressInfo: {
          name: '张三',
          gender: 1,
          tel: '18030565437',
          buyerAddress: '成都信息工程大学（航空港校区）12栋419',
        },
        detail: [
          {
            key: 1,
            id: '456412',
            productId: '4513',
            name: '柠檬红茶',
            price: 18,
            quantity: 1,
            specification: '["少糖","去冰"]',
            picture: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic4.zhimg.com%2F50%2Fv2-cd77bf010590b1404422439b94b39058_hd.jpg&refer=http%3A%2F%2Fpic4.zhimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1615041490&t=eca23d1f4cbbb9ef953d7cfcbea60776\n',
          },
          {
            key: 2,
            id: '456413',
            productId: '4513',
            name: '芋泥波波',
            price: 18,
            quantity: 2,
            specification: '["少糖","去冰","加芋圆"]',
            picture: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic4.zhimg.com%2F50%2Fv2-cd77bf010590b1404422439b94b39058_hd.jpg&refer=http%3A%2F%2Fpic4.zhimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1615041490&t=eca23d1f4cbbb9ef953d7cfcbea60776\n',
          }]
      }
    }
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
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '价格',
        dataIndex: 'price',
        key: 'price',
      },
      {
        title: '数量',
        dataIndex: 'quantity',
        key: 'quantity',
      },
      {
        title: '规格',
        dataIndex: 'specification',
        key: 'specification',
        render: (text, record, index) => <span>{JSON.parse(record.specification).toString()}</span>,
      },
    ];

    return (
      <Card>
        <Title level={4}>订单详情</Title>
        <div style={{textAlign: 'right'}}>
          <Button type="primary" shape="round" size="large">去配送</Button>
        </div>
        <Descriptions title={order.id} bordered>
          <Descriptions.Item label="店铺编号">{order.shopId}</Descriptions.Item>
          <Descriptions.Item label="店铺名称">{order.shopName}</Descriptions.Item>
          <Descriptions.Item label="订单总金额">{order.totalPrice}</Descriptions.Item>
          <Descriptions.Item label="配送费">{order.shippingFee}</Descriptions.Item>
          <Descriptions.Item label="优惠金额">{order.discount}</Descriptions.Item>
          <Descriptions.Item label="实付金额">{order.actualPrice}</Descriptions.Item>
          <Descriptions.Item label="取单号">{order.code}</Descriptions.Item>
          <Descriptions.Item label="订单状态">{order.status?'已完成':'待完成'}</Descriptions.Item>
          <Descriptions.Item label="下单时间">{order.createTime}</Descriptions.Item>
          <Descriptions.Item label="订单备注" span={3}>{order.remark}</Descriptions.Item>
          <Descriptions.Item label="买家信息" span={3}>
            {`${order.addressInfo.name}(${order.addressInfo.gender==1?'先生':'女士'})`}<br/>
            电话：{order.addressInfo.tel}<br/>
            地址：{order.addressInfo.buyerAddress}
          </Descriptions.Item>
          <Descriptions.Item label="订单详情" span={3}>
            <Table dataSource={order.detail} columns={columns} style={{width: 1200}} pagination={false} bordered />
          </Descriptions.Item>
        </Descriptions>
      </Card>
    );
  }
}
