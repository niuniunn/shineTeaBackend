import React,{Component} from 'react';
import { Form, Modal, Input, } from 'antd';

@Form.create()
export default class ModelCreate extends Component{
    handleSubmit = e => {
        e.preventDefault();
        // const {dispatch} = this.props;
        const _this = this;
        _this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(this.props);
                _this.props.dispatch({
                    type:'company/submit',
                    payload:values
                });
                console.log('Received values of form: ', values);
            }
        });
    };

    checkNum = (rule, value, callback) => {
        if (value > 0) {
            callback();
        }else {
            callback('必须输入正数');
        }
    };


    test(){
        console.log( this.props)
    }
    render() {
        const { visible, onCancel, onCreate,editFlag, form,formId,type,formData } = this.props;
        const { getFieldDecorator,setFieldsValue } = form;
        let inputStyle={
            width: '85%', marginRight: '3%'
        };
        let method = "新增";
        let name = "";
        let totalArea = "";
        let usedArea = "";
        if(editFlag){
            method = "修改";
            name = formData.name;
            totalArea = formData.totalArea;
            usedArea = formData.usedArea;
        }
        return (
            <Modal
                visible={visible}
                title={method}
                okText="确定"
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form layout="horizontal">
                    <Form.Item label="地点">
                        {getFieldDecorator('name', {
                            initialValue:name,
                            rules: [{ required: true, message: '请输入此项' }],
                        })(<Input style={inputStyle} placeholder="请输入地点" />)}

                    </Form.Item>
                    <Form.Item label="总建筑面积">
                        {getFieldDecorator('totalArea', {
                            initialValue:totalArea,
                            rules: [{ required: true, message: '请输入此项',
                                // validator: this.checkNum
                            }],
                        })(<Input style={inputStyle} placeholder="请输入数字" />)}<span>m<sup>2</sup></span>
                    </Form.Item>
                    <Form.Item label="总占地面积">
                        {getFieldDecorator('usedArea', {
                            initialValue:usedArea,
                            rules: [{ required: true, message: '请输入此项' }],
                        })(<Input style={inputStyle} placeholder="请输入数字" />)}<span>m<sup>2</sup></span>
                    </Form.Item>
                    {editFlag?
                        <Form.Item hidden>
                            {getFieldDecorator('id', {
                                initialValue:formId
                            })(<Input hidden/>)}</Form.Item>:''}
                </Form>
            </Modal>
        );
    }
}