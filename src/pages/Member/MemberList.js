import React from "react";
import {Card, Typography, Form, Row, Col, Input, Select, Button, Table} from "antd";
import styles from "@/assets/common.less";
import {connect} from "dva";

const { Title } = Typography;

@connect(({member})=>({
  memberPage: member.memberPage,
}))
@Form.create()
export default class MemberList extends React.Component{
  constructor() {
    super();
    this.state = {
      dataSource: [
        {
          key: 1,
          nickname: 'cici',
          tel: '18030565437',
          openid: 'hucvdsgjhcsuj',
          gender: 1,
          birthday: '1999-04-15',
          points: 100,
          createTime: '2021-04-12 15:33:12'
        },
        {
          key: 2,
          nickname: 'cici',
          tel: '18030565437',
          openid: 'hucvdsgjhcsuj',
          gender: 2,
          birthday: '1999-04-15',
          points: 100,
          createTime: '2021-04-12 15:33:12'
        },
        {
          key: 3,
          nickname: 'cici',
          tel: '18030565437',
          openid: 'hucvdsgjhcsuj',
          gender: 0,
          birthday: '1999-04-15',
          points: 100,
          createTime: '2021-04-12 15:33:12'
        },
      ],
      searchConditions: {
        page: 1,
        size: 10,
        nickname: '',
        tel: ''
      },
      currentPage: 1,
      total: 0,
    }
  }

  componentDidMount() {
    this.getList();
  }
  getList = ()=> {
    const {dispatch} = this.props;
    dispatch({
      type: 'member/getMemberPage',
      payload: {
        ...this.state.searchConditions,
        page: this.state.currentPage,
      }
    }).then(()=>{
      const memberPage = this.props.memberPage;
      this.setState({
        dataSource: memberPage.data,
        currentPage: memberPage.page,
        total: memberPage.total
      })
    })
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
  render() {
    const {getFieldDecorator} = this.props.form;
    const {dataSource} = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'number',
        key: 'number',
        align: 'center',
        render: (text,record,index) => <span>{index+1}</span>,
      },
      {
        title: '微信昵称',
        dataIndex: 'nickname',
        key: 'nickname',
      },
      {
        title: '手机号',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
      },
      {
        title: '微信openid',
        dataIndex: 'openid',
        key: 'openid',
      },
      {
        title: '性别',
        dataIndex: 'gender',
        key: 'gender',
        align: 'center',
        render: (text, record) => {
          switch (record.gender) {
            case 1: return '男';
            case 2: return '女';
            default: return '未知';
          }
        }
      },
      {
        title: '生日',
        dataIndex: 'birthday',
        key: 'birthday',
        align: 'center',
      },
      {
        title: '积分',
        dataIndex: 'points',
        key: 'points',
        align: 'center',
      }
    ];
    return (
      <Card>
        <Title level={4}>会员管理</Title>
        <div className={styles.search}>
          <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
            <Row gutter={20}>
              <Col span={5}>
                <Form.Item label='微信昵称'>
                  {getFieldDecorator('nickname',{initialValue: ''})(
                    <Input />
                  )}
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label='手机号'>
                  {getFieldDecorator('tel',{initialValue: ''})(
                    <Input />
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
        <div className={styles.table}>
          <Table columns={columns} dataSource={dataSource} />
        </div>
      </Card>
    );
  }
}
