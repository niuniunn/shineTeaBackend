import React from "react";
import {Card, Form, Icon, Typography, Row, Col, Input, Select, InputNumber, Upload, message, Button,Descriptions,Modal} from "antd";
import defaultSettings, {primaryColor} from '@/defaultSettings'
import {connect} from "dva";
import {router} from "umi";

const {Title} = Typography;
const {Option} = Select;
const { TextArea } = Input;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}
function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

@connect(({product,category})=>({
  categoryList: category.categoryList,
  isSuccess: product.isSuccess,
  productInfo: product.productInfo
}))
@Form.create()
export default class NewGoods extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      imageUrl: '',
      visible: false,
      currentIndex: -1,   //当前modal框编辑的数据索引
      flag: 0,  //1编辑规格  0新增规格
      type: '',  //编辑商品or新增商品
      categoryList: [],
      productInfo: {
        productId: "",
        productName: "",
        productPrice: "",
        productDescription: "",
        productPicture: "",
        productSpecification: "",
        categoryType: "",
        productStatus: "",
      },
      modalInfo: {
        title: "",
        specDetail: [
          {
            name: "",
            price: "",
          }
        ]
      },  //modal框中的数据
      specification: [
        {
          title: "甜度",
          specDetail: [
            {
              name: "标准糖",
              price: "0",
            },
            {
              name: "少糖",
              price: "0",
            },
          ]
        },
        {
          title: "温度",
          specDetail: [
            {
              name: "热",
              price: "0",
            },
            {
              name: "常温",
              price: "0",
            },
            {
              name: "去冰",
              price: "0",
            },
          ]
        },
      ],
    }
  }

  componentDidMount() {
    const {type, id} = this.props.history.location.query;
    this.getCategoryList();
    this.setState({type});
    if(type === 'edit') {
      //编辑
      const {dispatch} = this.props;
      dispatch({
        type: 'product/getProduct',
        payload: {id}
      }).then(()=>{
        const productInfo = this.props.productInfo;
        this.setState({
          productInfo,
          imageUrl: productInfo.productPicture,
          specification: JSON.parse(productInfo.productSpecification)
        })
      })
    }
  }

  getCategoryList = ()=> {
    const {dispatch} = this.props;
    dispatch({
      type: 'category/getCategoryList'
    }).then(()=>{
      const categoryList = this.props.categoryList;
      this.setState({
        categoryList,
      })
    })
  }
  showModal = (flag, modalInfo,index) => {
    if(!flag) {
     modalInfo = {
       title: "",
       specDetail: [
         {
           name: "",
           price: "",
         },
       ]
     };
    }
    this.setState({
      visible: true,
      modalInfo,
      flag,
      currentIndex: index!==undefined?index:-1
    });
  };

  handleOk = e => {
    const {flag,specification,modalInfo,currentIndex} = this.state;
    if(flag) {
      //编辑
      specification.splice(currentIndex,1,modalInfo);
    } else {
      //新增
      specification.push(modalInfo);
    }
    this.setState({
      visible: false,
      specification
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        console.log("规格：",this.state.specification);
        delete values.file;
        values.picture = this.state.imageUrl;
        values.specification = JSON.stringify(this.state.specification);
        console.log(values);
        const {dispatch} = this.props;
        if(this.state.type === 'new') {
          dispatch({
            type: 'product/newProduct',
            payload: values
          }).then(()=>{
            if(this.props.isSuccess) {
              router.push('/goods/goodsList')
            }
          })
        } else {
          values.id = this.state.productInfo.productId;
          dispatch({
            type: 'product/editProduct',
            payload: values
          }).then(()=>{
            if(this.props.isSuccess) {
              router.push('/goods/goodsList')
            }
          })
        }
      }
    });
  };
  //新增规格大类的子项
  newSubItem = ()=> {
    const modalInfo = this.state.modalInfo;
    const newData = {name: "", price: ""};
    modalInfo.specDetail.push(newData);
    this.setState({modalInfo});
  }
  //删除一个规格大类
  delItem = (index)=> {
    console.log("删除的项：",index);
    const specification = this.state.specification;
    //至少保留一个规格大类
    if(specification.length>1) {
      specification.splice(index, 1)
      this.setState({specification},()=>{
        console.log(this.state.specification);})
    }
  }
  //删除一个大类中的一个子项
  delSubItem = (index)=> {
    const modalInfo = this.state.modalInfo;
    //每个大类至少保留一个子项
    if(modalInfo.specDetail.length>1) {
      modalInfo.specDetail.splice(index,1);
      this.setState({modalInfo})
    }
  }
  modalChange = (e,index,type)=> {
    console.log(e,index, type);
    let modalInfo = this.state.modalInfo;
    if(index === undefined) {
      modalInfo.title = e.target.value;
    } else {
      if(type === "name") {
        modalInfo.specDetail[index].name = e.target.value;
        console.log("name");
      } else if(type === "price") {
        modalInfo.specDetail[index].price = e.target.value;
        console.log("price");
      }
    }
    this.setState({
      modalInfo
    })
  }

  render() {
    const {imageUrl, specification,modalInfo,categoryList,productInfo} = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {span: 4,},
      wrapperCol: {span: 12},
    };
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );
    const that = this;
    const props = {
      name: 'file',
      action: '/img/',
      data: {
        Token: defaultSettings.Token
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          that.setState({loading:true});
          message.info('上传文件中，请稍等...',2);
        }
        if (info.file.status === 'done') {
          const res = info.file.response;
          if(res.code){
            message.error(res.info);
          }else {
            that.setState({imageUrl:res.linkurl,loading:false});
            message.success("导入成功")
          }
        }

      },
    };
    const modalContent = (
      <div>
        规格名称：<Input style={{width: '180px', marginBottom: 10}} value={modalInfo.title} placeholder='请输入规格名称' onChange={(e)=>this.modalChange(e)} />
        <Icon type="plus-circle" style={{color: primaryColor,cursor: 'pointer',marginLeft: 20}} onClick={this.newSubItem} />
        <div style={{marginLeft: 20}}>
          {
            modalInfo.specDetail.map((item,index)=>(
              <div key={index}>
                <span>子项名称：<Input style={{width: '180px', marginBottom: 10}} value={item.name} onChange={(e)=>this.modalChange(e,index,"name")} /></span>
                <span style={{margin: '0 20px 0 30px'}}>子项价格：<Input style={{width: '140px', marginBottom: 10}} value={item.price} onChange={(e)=>this.modalChange(e,index,"price")} /></span>
                {
                  modalInfo.specDetail.length>1?(
                    <Icon type="minus-circle" style={{color: primaryColor, cursor: 'pointer'}} onClick={()=>this.delSubItem(index)} />
                  ):null
                }
              </div>
            ))
          }
        </div>
      </div>
    );
    const spec = (
      <Col push={1}>
        {
          specification.map((item,index)=>(
            <div key={index} style={{marginBottom: 20}}>
              <Descriptions title={item.title}>
                {
                  item.specDetail.map((subItem,idx)=>(
                    <Descriptions.Item key={idx} label={subItem.name}>¥ {subItem.price}</Descriptions.Item>
                  ))
                }
              </Descriptions>
              <div>
                <Button type="primary" size="small" onClick={()=>this.showModal(1,item,index)}>编辑</Button>
                {specification.length>1?(
                  <Button size="small" style={{marginLeft: 20}} onClick={()=>this.delItem(index)}>删除</Button>
                ):null}
              </div>
            </div>
          ))
        }
      </Col>
    );
    return (
      <Card>
        <Title level={4}>新增商品</Title>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item label="商品名称">
                {getFieldDecorator('name', {
                  initialValue: productInfo.productName?productInfo.productName:"",
                  rules: [
                    {
                      required: true,
                      message: '请输入商品名称！',
                    },
                  ],
                })(<Input />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item label='所属分类'>
                {getFieldDecorator('type',{
                  initialValue: productInfo.categoryType?productInfo.categoryType:(categoryList[0]?categoryList[0].categoryType:''),
                  rules:[{required:true,message: "请选择商品分类"}]})(
                  <Select style={{ width: 200 }}>
                    {
                      categoryList.map((item,index)=>(
                        <Option key={index} value={item.categoryType}>{item.categoryName}</Option>
                      ))
                    }
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item label='单价'>
                {getFieldDecorator('price',{
                  initialValue: productInfo.productPrice?productInfo.productPrice:'',
                  rules:[{required:true,message: "请输入单价"}]})(
                  <InputNumber min={0} max={999} step={0.1} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item label='描述'>
                {getFieldDecorator('desc',{
                  initialValue: productInfo.productDescription?productInfo.productDescription:'',
                  rules:[{required:true,message: "请输入描述信息"}]})(
                  <TextArea rows={4} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item label='商品图片'>
                {getFieldDecorator('file',{
                  initialValue: {},
                  rules:[{required:true,message: "请选择商品图片"}]})(
                  <Upload
                    name="file"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    {...props}
                  >
                    {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                  </Upload>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col push={1}>
              <div style={{margin: '0 0 20px 24px'}}>
                <span style={{color: 'red'}}>*</span> 规格信息：
              </div>
              {spec}
              <Col push={1}>
                <Button type="primary" onClick={()=>this.showModal(0)} style={{marginTop: 20}}>新增<Icon type="plus-circle" /></Button>
              </Col>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24} push={12}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Modal
          title="新增规格"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          destroyOnClose
          width={800}
        >
          {modalContent}
        </Modal>
      </Card>
    );
  }
}
