import React from "react";
import {Button, Card, Col, Form, Icon, Input, message, Modal, Row, Select, Table, Typography, Upload} from "antd";
import styles from "@/assets/common.less";
import {router} from "umi";

const { Title } = Typography;
const {Option} = Select;

@Form.create()
export default class GoodsList extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [
        {
          key: '0',
          id: 22,
          name: '四季奶青',
          type: '人气奶茶',
          desc: '这是产品描述，这是产品描述，这是产品描述，这是产品描述，这是产品描述，这是产品描述，这是产品描述，这是产品描述······',
          status: 1,
          price: 16.5,
          picture: 'https://7368-shinetea-9gye2q4w52899527-1304969792.tcb.qcloud.la/tempPic/QQ%E5%9B%BE%E7%89%8720210328204721.png',
          specification: [
            {
              title: "甜度",
              specId: 1,
              specDetail: [
                {
                  id: 11,
                  name: "无糖",
                  price: 0,
                },
                {
                  id: 12,
                  name: "微糖",
                  price: 0,
                },
                {
                  id: 13,
                  name: "半糖",
                  price: 0,
                },
                {
                  id: 14,
                  name: "少糖",
                  price: 0,
                },
                {
                  id: 15,
                  name: "换蜂蜜",
                  price: 2,
                }
              ]
            },
            {
              title: "温度",
              specId: 2,
              specDetail: [
                {
                  id:21,
                  name: "正常冰",
                  price: 0,
                }
              ]
            },
            {
              title: "小料",
              id: 3,
              specDetail: [
                {
                  id: 31,
                  name: "珍珠",
                  price: 0,
                },
                {
                  id: 32,
                  name: "焦糖布丁",
                  price: 2,
                },
                {
                  id: 33,
                  name: "芋泥",
                  price: 3,
                }
              ]
            }
          ],
        }
      ],
      visible: true,
    }
  }
  componentWillMount() {

  }

  newGoods = ()=> {
    router.push('/goods/newGoods?type=new');
  }
  render() {
    const {dataSource} = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'number',
        key: 'number',
        align: 'center',
        width: 80,
        render: (text,record,index) => <span>{index+1}</span>,
      },
      {
        title: '商品图片',
        dataIndex: 'picture',
        key: 'picture',
        align: 'center',
        render: (text, record) => <img src={record.picture} alt="产品图片" style={{width: 180}} />
      },
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center'
      },
      {
        title: '所属分类',
        dataIndex: 'type',
        key: 'type',
        align: 'center',
      },
      {
        title: '单价',
        dataIndex: 'price',
        key: 'price',
        align: 'center',
      },
      {
        title: '描述',
        dataIndex: 'desc',
        key: 'desc',
        width: 360,
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        render: (text, record) => (record.status?'在架':'下架')
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        render: (text, record) => (
          <span>
        <Button size="small" >{record.status?'下架':'上架'}</Button>
        <Button size="small" onClick={()=>this.editShop(record)}>编辑</Button>
        <Button size="small" onClick={()=>this.shopDetail(record)}>详情</Button>
        <Button size="small" type='primary'>删除</Button>
      </span>
        ),
      },
    ];
    const {getFieldDecorator} = this.props.form;
    return (
      <Card>
        <Title level={4}>商品管理</Title>
        <div className={styles.search}>
          <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
            <Row gutter={20}>
              <Col span={5}>
                <Form.Item label='商品名称'>
                  {getFieldDecorator('name',{initialValue: ''})(
                    <Input />
                  )}
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item label='所属分类'>
                  {getFieldDecorator('type',{initialValue: -1})(
                    <Select style={{ width: 80 }}>
                      <Option value={-1}>全部</Option>
                      <Option value={1}>果茶</Option>
                      <Option value={0}>奶茶</Option>
                      <Option value={2}>季节限定</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item label='状态'>
                  {getFieldDecorator('status',{initialValue: -1})(
                    <Select style={{ width: 80 }}>
                      <Option value={-1}>全部</Option>
                      <Option value={1}>在架</Option>
                      <Option value={0}>下架</Option>
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
        <Button type="primary" style={{marginBottom: 20}} onClick={this.newGoods}>新增+</Button>
        <div className={styles.table}>
          <Table columns={columns} dataSource={dataSource} />
        </div>
      </Card>
    );
  }

}
