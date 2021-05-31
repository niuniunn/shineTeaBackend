import React from "react";
import {Card, Divider, Statistic, Row, Col, Button} from "antd";

export default class Board extends React.Component{
  render() {
    const valStyle = {
      fontSize: 28,
      fontWeight: 700
    };
    return <Card>
      <Row gutter={16} type="flex" justify="space-around">
        <Col span={6}>
          <Statistic title="当前用户数" value={38324} valueStyle={valStyle} />
        </Col>
        <Col span={6}>
          <Statistic title="当日营业额" value={112893} precision={2} valueStyle={valStyle} />
        </Col>
      </Row>
    </Card>
  }
}
