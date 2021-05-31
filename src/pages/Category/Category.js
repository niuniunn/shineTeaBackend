import React from "react";
import { stringify } from 'qs';
import defaultSettings from '../../../src/defaultSettings';
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
      status: true,  //true为新增   false为编辑
      category: {
        /*categoryId: '',
        imageUrl: '',
        categoryName: '',
        categoryType: ''*/
      }
    }
  }

  componentDidMount() {
    this.getList();
  }
  getList = ()=> {
    const {dispatch} = this.props;
    dispatch({
      type: 'category/getCategoryList'
    }).then(()=>{
      const categoryList = this.props.categoryList;
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
  showModal = (record, status) => {
    console.log(record);
    if(!status) {
      //编辑
      this.setState({
        category: record,
        imageUrl: record.categoryIcon,
        status: false
      })
    } else {
      //新增
      this.setState({
        category: {},
        imageUrl: '',
        status: true
      })
    }
    this.setState({
      visible: true,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };
  handleSubmit = e => {
    e.preventDefault();
    this.setState({
      visible: false,
    });
    const {status} = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        delete values.file;
        values.categoryIcon = this.state.imageUrl;
        const {dispatch} = this.props;
        if(status) {
          //新增
          dispatch({
            type: 'category/newCategory',
            payload: values
          }).then(()=>{
            this.getList();
          })
        } else {
          values.categoryId = this.state.category.categoryId;
          console.log("参数：",values);
          dispatch({
            type: 'category/editCategory',
            payload: values
          }).then(()=>{
            this.getList();
          })
        }
      }
    });
  };
  delCategory = id => {
    const {dispatch} = this.props;
    dispatch({
      type: 'category/delCategory',
      payload: {categoryId: id}
    }).then(()=>{
      this.getList();
    })
  }
  render() {
    const {imageUrl, category} = this.state;
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
        render: (text, record) => (<img src={record.categoryIcon} alt="分类图标"/>)
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        render: (text, record) => (
          <span>
        <Button size="small" onClick={()=>this.showModal(record,false)}>编辑</Button>
        <Button size="small" type='primary' onClick={()=>this.delCategory(record.categoryId)}>删除</Button>
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
      <Form onSubmit={this.handleSubmit}>
        <div className="clearfix" style={{marginLeft: 60}}>
          <Form.Item label="分类编号">
            {getFieldDecorator('categoryType', {
              initialValue: category.categoryType?category.categoryType:'',
              rules: [{ required: true, message: '请输入分类编号' }],
            })(
              <Input placeholder='请输入分类编号' />,
            )}
          </Form.Item>
          <Form.Item label="分类名称">
            {getFieldDecorator('categoryName', {
              initialValue: category.categoryName?category.categoryName:'',
              rules: [{ required: true, message: '请输入分类名称' }],
            })(
              <Input placeholder='请输入分类名称' />,
            )}
          </Form.Item>
          <Form.Item label="分类图标">
            {getFieldDecorator('file', {
              rules: [{ required: true, message: '请选择分类图标' }],
            })(
              <Upload
                name="categoryIcon"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                accept=".jpg,.png,.jpeg" //上传照片接受格式
                {...props}
              >
                {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
              </Upload>
            )}
          </Form.Item>
          <Form.Item style={{float: 'right'}}>
            <Button type="primary" htmlType="submit">确定</Button>
          </Form.Item>
          <Form.Item style={{float: 'right', marginRight: 20}}>
            <Button onClick={this.handleCancel}>取消</Button>
          </Form.Item>
        </div>
      </Form>
    );
    return (
      <Card>
        <Title level={4}>分类管理</Title>
        <Divider />
        <Button type="primary" style={{marginBottom: 20}} onClick={()=>this.showModal(null,true)}>新增+</Button>
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
          footer={null}
          onCancel={this.handleCancel}
        >
          {modalContent}
        </Modal>
      </Card>
    );
  }
}
