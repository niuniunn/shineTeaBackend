import React from "react";
import {Button, Card, Col, DatePicker, Form, Icon, Input, InputNumber, Row, Select, Typography, Upload} from "antd";

const { Title } = Typography;
const { RangePicker } = DatePicker;
const {Option} = Select;

@Form.create()
export default class NewCoupon extends React.Component{

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.startTime = values.time[0].format("yyyy-MM-DD");
        values.endTime = values.time[1].format("yyyy-MM-DD");
        delete values.time;
        console.log('Received values of form: ', values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {span: 4,},
      wrapperCol: {span: 12},
    };
    return (
      <Card>
        <Title level={4}>优惠券生成</Title>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item label="使用条件">
                {getFieldDecorator('useCondition', {
                  initialValue: '',
                  rules: [
                    {
                      required: true,
                      message: '请输入使用条件',
                    },
                  ],
                })(<InputNumber style={{width: 200}} placeholder="满减金额" min={0} max={999} step={1} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item label='生效时段'>
                {getFieldDecorator('time',{initialValue: null,rules:[{required:true,message: "请选择优惠券使用时段"}]})(
                  <RangePicker />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item label="优惠金额">
                {getFieldDecorator('discount', {
                  initialValue: '',
                  rules: [
                    {
                      required: true,
                      message: '请输入优惠金额',
                    },
                  ],
                })(<InputNumber style={{width: 200}} placeholder="请输入优惠金额" min={0} max={50} step={1} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item label='可使用的订单类型'>
                {getFieldDecorator('orderType',{initialValue: 0,rules:[{required:true,message: "请选择可使用的订单类型"}]})(
                  <Select style={{ width: 200 }}>
                    <Option value={0}>无限制</Option>
                    <Option value={1}>仅自取</Option>
                    <Option value={2}>仅外送</Option>
                  </Select>
                )}
              </Form.Item>
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
      </Card>
    );
  }
}
