import React from "react";
import {Button, Card, Col, Form, Icon, Input, message, Modal, Row, Select, Table, Typography, Upload} from "antd";
import styles from "@/assets/common.less";
import {router} from "umi";
import {connect} from "dva";

const { Title } = Typography;
const {Option} = Select;

@connect(({product,category})=>({
  productPage: product.productPage,
  categoryList: category.categoryList,
}))
@Form.create()
export default class GoodsList extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      searchConditions: {
        page: 1,
        size: 10,
        name: '',
        type: '1',
        status: -1
      },
      currentPage: 1,
      total: 0,
      dataSource: [],
      categoryList: [],
      categoryMap: {},
      visible: true,
    }
  }
  componentWillMount() {
    this.getCategoryList();
    this.getList();
  }
  getCategoryList = ()=> {
    const {dispatch} = this.props;
    dispatch({
      type: 'category/getCategoryList'
    }).then(()=>{
      const categoryList = this.props.categoryList;
      let categoryMap = {};
      categoryList.map(item => {
        categoryMap[item.categoryType] = item.categoryName;
      })
      console.log(categoryMap);
      this.setState({
        categoryList,
        categoryMap
      })
    })
  }
  getList = ()=> {
    const {dispatch} = this.props;
    dispatch({
      type: 'product/getProductPage',
      payload: {
        ...this.state.searchConditions,
        page: this.state.currentPage,
      }
    }).then(()=>{
      const productPage = this.props.productPage;
      this.setState({
        dataSource: productPage.data,
        currentPage: productPage.page,
        total: productPage.total
      })
    })
  }
  newGoods = ()=> {
    router.push('/goods/newGoods?type=new');
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
  editProduct = (record) => {
    router.push('/goods/newGoods?type=edit' + `&id=${record.productId}`);
  }
  delProduct = id => {
    const {dispatch} = this.props;
    dispatch({
      type: 'product/delProduct',
      payload: {id}
    }).then(()=>{
      this.getList();
    })
  }
  updateProductStatus = record => {
    const {dispatch} = this.props;
    dispatch({
      type: 'product/updateProductStatus',
      payload: {
        id: record.productId,
        status: record.productStatus?0:1
      }
    }).then(()=>{
      this.getList();
    })
  }
  render() {
    const {dataSource, categoryList, categoryMap} = this.state;
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
        dataIndex: 'productPicture',
        key: 'productPicture',
        align: 'center',
        render: (text, record) => <img src={record.productPicture} alt="产品图片" style={{width: 180}} />
      },
      {
        title: '商品名称',
        dataIndex: 'productName',
        key: 'productName',
        align: 'center'
      },
      {
        title: '所属分类',
        dataIndex: 'categoryType',
        key: 'categoryType',
        align: 'center',
        render: (text, record) => (categoryMap[record.categoryType])
      },
      {
        title: '单价',
        dataIndex: 'productPrice',
        key: 'productPrice',
        align: 'center',
      },
      {
        title: '描述',
        dataIndex: 'productDescription',
        key: 'productDescription',
        width: 360,
      },
      {
        title: '状态',
        dataIndex: 'productStatus',
        key: 'productStatus',
        align: 'center',
        render: (text, record) => (record.productStatus?'在架':'下架')
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        render: (text, record) => (
          <span>
        <Button size="small" onClick={()=>this.updateProductStatus(record)}>{record.productStatus?'下架':'上架'}</Button>
        <Button size="small" onClick={()=>this.editProduct(record)}>编辑</Button>
        <Button size="small" type='primary' onClick={()=>this.delProduct(record.productId)}>删除</Button>
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
                  {getFieldDecorator('type',{initialValue: 1})(
                    <Select style={{ width: 80 }}>
                      <Option value={1}>全部</Option>
                      {
                        categoryList.map((item,index)=>(
                          <Option key={index} value={item.categoryType}>{item.categoryName}</Option>
                        ))
                      }
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
