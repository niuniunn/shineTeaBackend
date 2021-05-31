import React, { Component } from 'react';
import { connect } from 'dva';
import { Card,Row, Col, Button, Icon, Input,Modal ,Form, Popconfirm, message } from 'antd';
import ModelCreate from "./ModelCreate";
const { Search } = Input;
const { Meta } = Card;

function showNum(Num){
  if(!(Num===undefined)&&Num!==null){
    return Num.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,");
  }
  return ''
}
@connect(({ }) => ({}))
export default class Index extends Component {

  state = {
    // 模态框表单相关，开关、变更类型（增/改）、数据详情、表单id
    visible: false,
    editFlag:false,
    formData:[],
    formId:'',

    // 接口返回数据
    res:[{
      id:1,
      totalArea:'114514',
      usedArea:'23333',
      name:'一号大楼'
    }

    ],

    // 编辑状态相关
    cardAction:false,
    editText:'编辑',

  };
  confirm=(id)=> {
    // this.props.dispatch({
    //   type:'company/del',
    //   payload:{
    //     id:id
    //   }
    // });
    message.success('项目已删除！');
    location.reload(false);
  };

  cancel=(e)=> {
    console.log(e);
  };

  showModal = (editFlag,id,formData) => {
    this.setState({ visible: true,editFlag:editFlag,formId:id,formData:formData });
  };

  handleCancel = () => {
    this.setState({ visible: false, editFlag:false, formData:[], formId:-1, });
  };

  handleCreate = () => {
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      // this.props.dispatch({
      //   type:'company/submit',
      //   payload:values,
      //   companyCallBack:this.handleCallBack
      // });
      form.resetFields();
      this.setState({ visible: false, editFlag:false, formData:[], formId:-1 });
      location.reload(false);
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };
  pageEdit = () => {
    if(this.state.cardAction){
      this.setState({ cardAction:false,editText:'编辑' });
    }else {
      this.setState({ cardAction:true,editText:'返回' });
    }
  };

  componentDidMount(){
    this.showInformation();
  }

  handleCallBack= (res)=> {
    if(res === undefined|| res===null||res===''){
      message.error('接口请求超时,请联系管理员');
      window.location.href=`/#/login`
    }else {
      this.setState({ res: res });
    }
  };
  showInformation(){
    // this.props.dispatch({
    //   type:'company/fetch',
    //   payload:'',
    //   companyCallBack:this.handleCallBack
    // });
  };

  authCheck(){
    // let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    // return (userInfo.role==='ADMIN');
    return true;
  }

  render() {
    let { cardAction } = this.state;
    let {editText} = this.state;

    let col = 8;
    let spanStyle={
      fontSize: '20px',
      textAlign: 'left',
      fontWeight:'bold',
      color:'black',
      opacity:'0.8',
    };
    let areaStyle={
      fontSize: '24px',
    };
    let cardStyle1={
      backgroundColor:'#fdfdfd',
      marginBottom:'20px'
      // height:'230px'
    };
    let cardStyleAdd1={
      backgroundColor:'#fdfdfd',
      height:'178px',
      lineHeight:'178px',
      textAlign:'center',
      cursor: "pointer",
      marginBottom:'20px'
    };
    let point={
      cursor:'pointer'
    };
    let noPoint={
      cursor:'default'
    };
    return (
      <Card style={{minHeight:'800px'}}>
        <div>
          {/*<h3 style={{ fontWeight:'bold',opacity:'0.6'}}>数据展示</h3>*/}
        </div>

        <div>
          <span style={spanStyle}><a style={{color:'black'}}>卡片样式</a></span>
          {this.authCheck()?
            <Button style={{ float: 'right'}} onClick={(()=>this.pageEdit())} type="primary">
              <Icon type={cardAction?'close':'edit'}/>{editText}
            </Button>
            :''
          }
        </div>
        <br>
        </br>
        <div className="ant-card-bordered">
        </div>
        <br>
        </br>
        <div>
          <Row gutter={24}>
            {this.state.res.map((item,index)=>(
              <Col span={col} key={index}>
                <div className={item.id} style={cardAction?noPoint:point} onClick={cardAction?'':()=>{window.location.href="/#/components/card"}}>
                  <Card
                    style={cardStyle1}
                    cover={
                      <h2 style={{textAlign:'center',margin: '20px auto', fontWeight:'bold'}}>{item.name}</h2>
                    }
                    actions={
                      cardAction ?
                        [
                          <Icon type="edit" key="edit" onClick={()=>(this.showModal(true,item.id,item))}/>,
                          <Popconfirm
                            title="确定删除此项目？"
                            onConfirm={()=>this.confirm(item.id)}
                            onCancel={this.cancel}
                            okText="是"
                            cancelText="否"
                          >
                            <Icon type="delete" key="delete" />
                          </Popconfirm>
                        ] : []}
                  >
                    <div style={{textAlign:'center'}}>
                      <Col span={12}>
                        <span>总建筑面积</span>
                        <br></br>
                        <b><span style={areaStyle}>{showNum(item.totalArea)}</span>m<sup>2</sup></b>
                      </Col>
                      <Col span={12}>
                        <span>总占地面积</span>
                        <br></br>
                        <b><span style={areaStyle}>{showNum(item.usedArea)}</span>m<sup>2</sup></b>
                      </Col>
                    </div>
                  </Card>
                </div>
              </Col>
            ))}
            {this.authCheck()?
              <Col span={cardAction?0:col}>
                <div>
                  <Card style={cardStyleAdd1} onClick={()=>(this.showModal(false))}>
                    <Icon type="plus" key="plus" style={{fontSize: '50px',margin:'auto'}}/>
                  </Card>
                </div>
              </Col>
              :''}
          </Row>
          <ModelCreate
            wrappedComponentRef={this.saveFormRef}
            visible={this.state.visible}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
            editFlag={this.state.editFlag}
            formId={this.state.formId}
            formData={this.state.formData}
          />
        </div>

      </Card>
    );
  }
}
