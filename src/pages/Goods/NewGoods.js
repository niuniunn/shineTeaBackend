import React from "react";
import {Card, Form, Icon, Typography, Row, Col, Input, Select, InputNumber, Upload, message, Button,Descriptions,Modal} from "antd";
import {primaryColor} from '@/defaultSettings'

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

@Form.create()
export default class NewGoods extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      imageUrl: '',
      visible: false,
      currentIndex: -1,   //当前modal框编辑的数据索引
      flag: 0,  //1编辑  0新增
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
    console.log(modalInfo);
    this.setState({
      visible: true,
      modalInfo,
      flag,
      currentIndex: index?index:-1
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
    const {imageUrl, specification,modalInfo} = this.state;
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
    /*const spec = (
      specification.map((item, index)=>(
        <div key={index}>
          <Row gutter={[16,32]}>
            <Col push={1}>
            </Col>
          </Row>
          <Row gutter={[16,24]}>
            <Col span={8} push={1}>
              <Form.Item label="规格名称">
                {getFieldDecorator(`specification[${index}].title`,{rules:[{required:true,message: "请输入名称"}]})(
                  <Input />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Button type="primary" onClick={()=>this.delItem(index)}>删除</Button>
            </Col>
          </Row>
          {
            item.specDetail.map((subItem, idx)=>(
              <Row key={''+index+idx}>
                <Col span={6} push={2}>
                  <Form.Item label="规格项">
                    {getFieldDecorator(`specification[${index}].specDetail[${idx}].name`,{initialValue: subItem.name,rules:[{required:true,message: "请输入子项名称"}]})(
                      <Input />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8} push={2}>
                  <Form.Item label="子项价格">
                    {getFieldDecorator(`specification[${index}].specDetail[${idx}].price`,{initialValue: subItem.price,rules:[{required:true,message: "请输入子项价格"}]})(
                      <InputNumber step={0.1} min={0} max={999} />
                    )}
                  </Form.Item>
                </Col>
                <Col span={2} pull={2}>
                  <div style={{color: primaryColor, cursor: 'pointer',textDecoration: 'underline',lineHeight: '38px'}} onClick={()=>this.delSubItem(index,idx)}>删除</div>
                </Col>
              </Row>
            ))
          }
          <Row>
            <Col span={8} push={2}>
              <div style={{color: primaryColor, marginLeft: 20, textDecoration: 'underline'}}><span onClick={()=>this.newSubItem(index)} style={{cursor: 'pointer'}}>新增子项</span></div>
            </Col>
          </Row>
        </div>
      ))
    );*/
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
                  initialValue: ''/*shopInfo.name!==''?shopInfo.name:''*/,
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
                {getFieldDecorator('type',{initialValue: -1,rules:[{required:true,message: "请选择商品分类"}]})(
                  <Select style={{ width: 200 }}>
                    <Option value={-1}>奶茶</Option>
                    <Option value={1}>果茶</Option>
                    <Option value={0}>纯茶</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item label='单价'>
                {getFieldDecorator('price',{initialValue: "",rules:[{required:true,message: "请输入单价"}]})(
                  <InputNumber min={0} max={999} step={0.1} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item label='描述'>
                {getFieldDecorator('desc',{initialValue: "",rules:[{required:true,message: "请输入描述信息"}]})(
                  <TextArea rows={4} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item label='商品图片'>
                {getFieldDecorator('picture',{rules:[{required:true,message: "请输入单价"}]})(
                  <Upload
                    name="icon"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={this.handleChange}
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
          width={800}
        >
          {modalContent}
        </Modal>
      </Card>
    );
  }
}
