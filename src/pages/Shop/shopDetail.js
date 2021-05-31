import React from "react";
import {Card, Typography, Descriptions, Badge} from "antd";
import {connect} from "dva";

const { Title } = Typography;
@connect(({shop})=>({
  shopInfo: shop.shopInfo,
}))
export default class ShopDetail extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      shopInfo: {
        id: '1',
        name: '空港华联店',
        tel: '18030565437',
        latitude: 30.57173,
        longitude: 103.987235,
        startTime: '10:00',
        endTime: '22:00',
        address: '双流区北京华联',  //表单address和detail拼接后的值
        detail: '3L405号',
        remark: '备注',
      }
    }
  }

  componentDidMount() {
    const id = this.props.history.location.query.id;
    const {dispatch} = this.props;
    dispatch({
      type: 'shop/findShopById',
      payload: {id}
    }).then(()=>{
      this.setState({
        shopInfo: this.props.shopInfo
      },()=>{
        this.createScript();
        setTimeout(this.initMap,1000);  //要等append之后TMap才不会报undefine
      })
    })
  }

  createScript = ()=> {
    let script = document.querySelector('#script');
    if (script) {
      return;
    }
    script = document.createElement('script');
    script.id = 'script';
    script.src = 'https://map.qq.com/api/gljs?v=1.exp&key=K4BBZ-VLBKF-3UKJA-JN2NE-2PHOT-Y5F5B';
    document.querySelector('head').appendChild(script);   //要append在head里面才有效
  }

  initMap = ()=> {
    const shopInfo = this.state.shopInfo;
    //定义地图中心点坐标
    var center = new TMap.LatLng(shopInfo.latitude, shopInfo.longitude);
    //定义map变量，调用 TMap.Map() 构造函数创建地图
    var map = new TMap.Map(document.getElementById('container'), {
      center: center,//设置地图中心点坐标
      zoom: 17.2,   //设置地图缩放级别
      pitch: 43.5,  //设置俯仰角
      rotation: 45    //设置地图旋转角度
    });

    //初始化marker
    var marker = new TMap.MultiMarker({
      id: "marker-layer", //图层id
      map: map,
      styles: { //点标注的相关样式
        "marker": new TMap.MarkerStyle({
          "width": 25,
          "height": 35,
          "anchor": { x: 16, y: 32 },
          "src": "https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png"
        })
      },
      geometries: [{ //点标注数据数组
        "id": "shop",
        "styleId": "marker",
        "position": new TMap.LatLng(this.state.shopInfo.latitude, this.state.shopInfo.longitude),
        "properties": {
          "title": "闲茶"
        }
      }]
    });
  }
  render() {
    const {shopInfo} = this.state;
    return (
      <Card>
        <Title level={4}>门店详情</Title>
        <Descriptions title="闲茶空港华联店" bordered>
          <Descriptions.Item label="门店编号">{shopInfo.shopId}</Descriptions.Item>
          <Descriptions.Item label="门店名称">{shopInfo.shopName}</Descriptions.Item>
          <Descriptions.Item label="门店电话">{shopInfo.phoneNumber}</Descriptions.Item>
          <Descriptions.Item label="营业时间">{shopInfo.openTime}-{shopInfo.closeTime}</Descriptions.Item>
          <Descriptions.Item label="门店地址" span={2}>
            {shopInfo.address + shopInfo.addressDetail}
          </Descriptions.Item>
          <Descriptions.Item label="备注">
            {shopInfo.shopRemark}
          </Descriptions.Item>
        </Descriptions>
        <h3 style={{fontWeight: 700, margin: '20px 0'}}>位置信息</h3>
        <div id='container' style={{width: '100%', height: 600}}> </div>
      </Card>
    );
  }

}
