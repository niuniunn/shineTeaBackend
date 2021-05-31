import React from "react";
import {Card, Form, Input, Col, Row, Select, Button, Table, Typography} from "antd";
import styles from "@/assets/common.less";
import {router} from "umi";
import {connect} from "dva";

const {Option} = Select;
const { Title } = Typography;

@connect(({shop})=>({
  shopPage: shop.shopPage,
}))
@Form.create()
export default class Shop extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      searchConditions: {
        page: 1,
        size: 10,
        name: '',
        address: '',
        isOpen: 1
      },
      currentPage: 1,
      total: 0,
      dataSource: []
    }
  }

  componentDidMount() {
    this.getShopPage();
  }

  getShopPage = ()=> {
    const {dispatch} = this.props;
    dispatch({
      type: 'shop/getShopList',
      payload: {
        ...this.state.searchConditions,
        page: this.state.currentPage,
      }
    }).then(()=>{
      const shopPage = this.props.shopPage;
      this.setState({
        dataSource: shopPage.data,
        currentPage: shopPage.page,
        total: shopPage.total
      })
    })
  }

  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.setState({
        searchConditions: {...this.state.searchConditions,...values}
      },()=>{
        this.getShopPage();
      })
    });
  };
  handleReset = () => {
    this.props.form.resetFields();
  };
  newShop = () => {
    router.push('/shop/newShop?type=new');
  }
  editShop = (record) => {
    router.push('/shop/newShop?type=edit' + `&id=${record.shopId}`);
  }
  shopDetail = (record)=> {
    router.push(`/shop/shopDetail?id=${record.shopId}`);
  }
  updateStatus = (record)=> {
    let id = record.shopId,
      isOpen = record.isOpen;
    const {dispatch} = this.props;
    dispatch({
      type: 'shop/updateStatus',
      payload: {
        id,
        isOpen: isOpen?0:1
      }
    }).then(()=>{
      this.getShopPage();
    })
  }


  render() {
    const {dataSource} = this.state;
    const {getFieldDecorator} = this.props.form;
    const columns = [
      {
        title: '序号',
        dataIndex: 'number',
        key: 'number',
        align: 'center',
        render: (text,record,index) => <span>{index+1}</span>,
      },
      {
        title: '门店编号',
        dataIndex: 'shopId',
        key: 'shopId',
        align: 'center',
      },
      {
        title: '门店名称',
        dataIndex: 'shopName',
        key: 'shopName',
      },
      {
        title: '门店电话',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
        align: 'center',
      },
      {
        title: '门店地址',
        dataIndex: 'address',
        key: 'address',
        render: (text, record) => (record.address + record.addressDetail)
      },
      {
        title: '状态',
        dataIndex: 'isOpen',
        key: 'isOpen',
        align: 'center',
        render: (text, record) => (record.isOpen?'营业中':'歇业中')
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        render: (text, record) => (
          <span>
        <Button size="small" onClick={()=>this.updateStatus(record)}>{record.isOpen?'禁用':'启用'}</Button>
        <Button size="small" onClick={()=>this.editShop(record)}>编辑</Button>
        <Button size="small" onClick={()=>this.shopDetail(record)}>详情</Button>
        <Button size="small" type='primary'>删除</Button>
      </span>
        ),
      },
    ];
    return <Card>
      <Title level={4}>门店管理</Title>
      <div className={styles.search}>
        <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
          <Row gutter={20}>
            <Col span={5}>
              <Form.Item label='门店名称'>
                {getFieldDecorator('shopName',{initialValue: ''})(
                  <Input />
                )}
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label='门店地址'>
                {getFieldDecorator('address',{initialValue: ''})(
                  <Input />
                )}
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item label='状态'>
                {getFieldDecorator('isOpen',{initialValue: -1})(
                  <Select style={{ width: 80 }}>
                    <Option value={-1}>全部</Option>
                    <Option value={1}>营业中</Option>
                    <Option value={0}>歇业中</Option>
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
      <Button type="primary" style={{marginBottom: 20}} onClick={this.newShop}>新增+</Button>
      <div className={styles.table}>
        <Table columns={columns} dataSource={dataSource} />
      </div>
    </Card>
  }
}
