import React, { Component } from 'react';
import { Card,Tabs} from 'antd';
import styles from './Header.less';

const { TabPane } = Tabs;

class TopNavHeader extends Component {


  componentDidMount() {

  }

  render() {
      const content = <Tabs defaultActiveKey="1" >
          <TabPane tab="Tab 1" key="1">
              {/*<Apply />*/}
          </TabPane>
          <TabPane tab="Tab 2" key="2">
              Content of Tab Pane 2
          </TabPane>
          <TabPane tab="Tab 3" key="3">
              Content of Tab Pane 3
          </TabPane>
      </Tabs>;
      return (
          <Card>
            { content }
          </Card>
          );
  }
}
export default TopNavHeader;
