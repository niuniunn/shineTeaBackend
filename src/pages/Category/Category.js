import React from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Typography,
  Table,
  Icon,
  Tooltip,
  Modal,
  Upload,
  message,
  Divider
} from "antd";
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import styles from "@/assets/common.less";
import {connect} from "dva";

const { Title } = Typography;

let dragingIndex = -1;

class BodyRow extends React.Component {
  render() {
    const { isOver, connectDragSource, connectDropTarget, moveRow, ...restProps } = this.props;
    const style = { ...restProps.style, cursor: 'move' };

    let { className } = restProps;
    if (isOver) {
      if (restProps.index > dragingIndex) {
        className += ' drop-over-downward';
      }
      if (restProps.index < dragingIndex) {
        className += ' drop-over-upward';
      }
    }

    return connectDragSource(
      connectDropTarget(<tr {...restProps} className={className} style={style} />),
    );
  }
}

const rowSource = {
  beginDrag(props) {
    dragingIndex = props.index;
    return {
      index: props.index,
    };
  },
};

const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Time to actually perform the action
    props.moveRow(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}))(
  DragSource('row', rowSource, connect => ({
    connectDragSource: connect.dragSource(),
  }))(BodyRow),
);

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
@connect(({category})=>({
  categoryList: category.categoryList,
}))
@Form.create()
export default class Category extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      visible: false ,   //Modal框
      loading: false,  //上传图片
      imageUrl: '',
      type: '',
      name: '',
    }
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'category/getCategoryList'
    }).then(()=>{
      const categoryList = this.props.categoryList;
      console.log(categoryList);
      this.setState({
        data: categoryList
      })
    })
  }

  components = {
    body: {
      row: DragableBodyRow,
    },
  };

  moveRow = (dragIndex, hoverIndex) => {
    const { data } = this.state;
    const dragRow = data[dragIndex];

    this.setState(
      update(this.state, {
        data: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
        },
      }),
      ()=>{
        let newData = this.state.data;
        newData.map((item,index)=>{
          newData[index].index = index;
        })
        console.log('new: ',newData);
      }
    );
  };
  showModal = (record) => {
    console.log(record);
    if(record !== undefined) {
      //编辑
      this.setState({
        imageUrl: record.icon,
        name: record.name,
        type: record.type
      })
    } else {
      //新增
      this.setState({
        imageUrl: '',
        name: '',
        type: ''
      })
    }
    this.setState({
      visible: true,
    });
  };
  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };
  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };
  /*handleSearch = e => {
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
  };*/
  //上传图片
  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }
  };
  render() {
    const {imageUrl, type, name} = this.state;
    const {getFieldDecorator} = this.props.form;
    const columns = [
      {
        title: <Tooltip title='拖动表格行可进行排序'>分类顺序 <Icon type="question-circle" /></Tooltip>,
        dataIndex: 'number',
        key: 'number',
        align: 'center',
        width: '160px',
        render: (text,record,index) => <span>{index+1}</span>,
      },
      {
        title: '分类名称',
        dataIndex: 'categoryName',
        key: 'categoryName',
        align: 'center',
      },
      {
        title: '分类编号',
        dataIndex: 'categoryType',
        key: 'categoryType',
        align: 'center',
      },
      {
        title: '分类图标',
        dataIndex: 'categoryIcon',
        key: 'categoryIcon',
        align: 'center',
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        render: (text, record) => (
          <span>
        <Button size="small" onClick={()=>this.showModal(record)}>编辑</Button>
        <Button size="small" type='primary'>删除</Button>
      </span>
        ),
      },
    ];
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );
    const modalContent = (
      <div style={{marginLeft: 60}}>
        分类编号：<Input style={{width: '180px', marginBottom: 10}} value={type} placeholder='请输入分类编号' /><br/>
        分类名称：<Input style={{width: '180px', marginBottom: 10}} value={name} placeholder='请输入分类名称' /><br/>
        分类图标：
        <div style={{marginLeft: 70}}>
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
        </div>
      </div>
    );
    return (
      <Card>
        <Title level={4}>分类管理</Title>
        <Divider />
        {/*<div className={styles.search}>
          <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
            <Row gutter={20}>
              <Col span={5}>
                <Form.Item label='分类名称'>
                  {getFieldDecorator('name',{initialValue: ''})(
                    <Input />
                  )}
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label='分类编号'>
                  {getFieldDecorator('type',{initialValue: ''})(
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
        </div>*/}
        <Button type="primary" style={{marginBottom: 20}} onClick={()=>this.showModal()}>新增+</Button>
        <div className={styles.table}>
          <DndProvider backend={HTML5Backend}>
            <Table
              columns={columns}
              dataSource={this.state.data}
              components={this.components}
              onRow={(record, index) => ({
                index,
                moveRow: this.moveRow,
              })}
            />
          </DndProvider>
        </div>
        <Modal
          title="分类编辑"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          {modalContent}
        </Modal>
      </Card>
    );
  }
}
