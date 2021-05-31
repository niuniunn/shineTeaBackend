import React from "react";
import {Card, Form, Typography, Input, Col, Row, TimePicker, Button, Icon, Tooltip} from "antd";
import moment from 'moment';
import {connect} from "dva";
import {router} from "umi";

const { Title } = Typography;
const { TextArea } = Input;
const format = 'HH:mm';
let mapSrc = 'https://apis.map.qq.com/tools/locpicker?search=1&type=1&mapdraggable=1&key=K4BBZ-VLBKF-3UKJA-JN2NE-2PHOT-Y5F5B&referer=shineTea';

@connect(({shop})=>({
  isSuccess: shop.isSuccess,
  shopInfo: shop.shopInfo
}))
@Form.create()
export default class NewShop extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      latlng: {}, //记录经纬度
      type: '',  //new 或  edit
      shopInfo: {
        name: '',
        tel: '',
        latitude: '',
        longitude: '',
        startTime: '',
        endTime: '',
        address: '',
        detail: '',
        remark: '',
      },
    }
  }

  componentDidMount() {
    const type = this.props.history.location.query.type;
    this.setState({type});
    if(type === 'edit') {
      const id = this.props.history.location.query.id;
      const {dispatch} = this.props;
      dispatch({
        type: 'shop/findShopById',
        payload: {id}
      }).then(()=>{
        const shopInfoTemp = this.props.shopInfo;
        const shopInfo = {};
        shopInfo.name = shopInfoTemp.shopName;
        shopInfo.tel = shopInfoTemp.phoneNumber;
        shopInfo.latitude = shopInfoTemp.latitude;
        shopInfo.longitude = shopInfoTemp.longitude;
        shopInfo.startTime = shopInfoTemp.openTime;
        shopInfo.endTime = shopInfoTemp.closeTime;
        shopInfo.address = shopInfoTemp.address;
        shopInfo.detail = shopInfoTemp.addressDetail;
        shopInfo.remark = shopInfoTemp.shopRemark;
        shopInfo.id = shopInfoTemp.shopId;
        mapSrc += `&coord=${shopInfo.latitude},${shopInfo.longitude}`;
        this.setState({shopInfo},()=>{
          let that = this;
          window.addEventListener('message', function(event) {
            // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
            var loc = event.data;
            if (loc && loc.module == 'locationPicker') {//防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
              console.log('location', loc);
              that.props.form.setFieldsValue({address: loc.poiaddress});
              that.setState({latlng: loc.latlng});
            }
          }, false);
        });
      })
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        let shopInfo = {
          name: '',
          tel: '',
          latitude: '',
          longitude: '',
          startTime: '',
          endTime: '',
          address: '',
          detail: '',
          remark: '',
        }
        values.startTime = values.startTime.format(format);
        values.endTime = values.endTime.format(format);
        const latlng = this.state.latlng;
        shopInfo.latitude = latlng.lat;
        shopInfo.longitude = latlng.lng;
        shopInfo = {...shopInfo, ...values};
        console.log('提交的店铺信息：',shopInfo);
        const {dispatch} = this.props;
        if(this.state.type === "new") {
          dispatch({
            type: "shop/newShop",
            payload: shopInfo
          }).then(()=>{
            if(this.props.isSuccess) {
              router.push('/shop/shop');
            }
          })
        } else {
          shopInfo.id = this.state.shopInfo.id;
          if(!shopInfo.latitude || !shopInfo.longitude) {
            shopInfo.latitude = this.state.shopInfo.latitude;
            shopInfo.longitude = this.state.shopInfo.longitude;
          }
          dispatch({
            type: "shop/editShop",
            payload: shopInfo
          }).then(()=>{
            if(this.props.isSuccess) {
              router.push('/shop/shop');
            }
          })
        }
      }
    });
  };

  render() {
    const formItemLayout = {
      labelCol: {span: 4,},
      wrapperCol: {span: 12},
    };
    const { getFieldDecorator } = this.props.form;
    const {type, shopInfo} = this.state;
    return (
      <Card style={{position: 'relative'}}>
        <Title level={4}>{type=='new'?'新增':'编辑'}门店</Title>
        <div style={{zIndex: 999,position: 'absolute',right: 50,top: 30,width: 700, height: 600}}>
          <iframe style={{ border: 0, width: "100%", height: '100%',}} src={mapSrc} />
        </div>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Row gutter={[16,32]}>
            <Col span={16}>
              <Form.Item label="门店名称">
                {getFieldDecorator('name', {
                  initialValue: shopInfo.name!==''?shopInfo.name:'',
                  rules: [
                    {
                      required: true,
                      message: '请输入门店名称！',
                    },
                  ],
                })(<Input />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16,32]}>
            <Col span={16}>
              <Form.Item label="门店电话" wrapperCol={{span: 6}}>
                {getFieldDecorator('tel', {
                  initialValue: shopInfo.tel!==''?shopInfo.tel:'',
                  rules: [
                    {
                      required: true,
                      message: '请输入门店电话！',
                    },
                  ],
                })(<Input />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16,32]}>
            <Col span={16}>
              <Form.Item label="门店营业时间" wrapperCol={{span: 6}}>
                {getFieldDecorator('startTime', {
                  initialValue: moment(shopInfo.startTime!==''?shopInfo.startTime:'10:00', format),
                  rules: [{required: true,}],
                })(<TimePicker format={format} />)}
              </Form.Item>
            </Col>
            <Col span={8} pull={11}>
              <Form.Item label="" wrapperCol={{span: 8}}>
                {getFieldDecorator('endTime', {
                  initialValue: moment(shopInfo.endTime!==''?shopInfo.endTime:'10:00', format),
                  rules: [{required: true,}],
                })(<TimePicker format={format} />)}
              </Form.Item>
            </Col>
          </Row>
          {/*<Row>
            <div style={{width: '100%',height: 400}} id='container'> </div>
          </Row>*/}
          <Row gutter={[16,32]}>
            <Col span={16}>
              <Form.Item label={<Tooltip title='在右方地图选点后自动填写'>门店地址<Icon type="question-circle" /></Tooltip>}>
                {getFieldDecorator('address', {
                  initialValue: shopInfo.address!==''?shopInfo.address:'',
                  rules: [
                    {
                      required: true,
                      message: '请选择门店地址',
                    },
                  ],
                })(<Input disabled />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16,32]}>
            <Col span={16}>
              <Form.Item label="详细地址">
                {getFieldDecorator('detail', {
                  initialValue: shopInfo.detail!==''?shopInfo.detail:'',
                  rules: [
                    {
                      required: true,
                      message: '请输入详细地址',
                    },
                  ],
                })(<Input placeholder='具体到门牌号' />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16,32]}>
            <Col span={16}>
              <Form.Item label="门店备注">
                {getFieldDecorator('remark',{
                  initialValue: shopInfo.remark!==''?shopInfo.remark:'',
                })(<TextArea rows={4} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16,32]}>
            <Col span={24} push={12}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }

}
