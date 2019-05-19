import React, { PureComponent } from 'react';
import {
  Card,
  Button,
  Form,
  Tree,
  Col,
  Row,
  Input,
  Radio,
  InputNumber,
  Icon,
} from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Dept.less';

const { TreeNode } = Tree;
const {Search} = Input;
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

@connect(state => ({
  manaDept: state.manaDept,
}))
@Form.create()
class DeptMana extends PureComponent {
  constructor(props) {
    super(props);
    this.state={
      EnableShowEditCard:false,
      EnableShowAddCard:false,
      EnableShowViewCard:true,
      moduleDetail:{},
    }
  }

  componentDidMount() {
    const { dispatch, match: { params } } = this.props;
    dispatch({
      type: 'manaDept/fetch',
      payload: params,
      callback:(response)=>{
        if(response.status&&response.data.length>0){
          this.setState({
            moduleDetail:response.data[0],
          })
        }
      },
    });
  }

  getDeptTree = () =>{
    const { dispatch} = this.props;
    dispatch({
      type: 'manaDept/fetch',
      callback:(response)=>{
        if(response.status&&response.data.length>0){
          this.setState({
            moduleDetail:response.data[0],
          })
        }
      },
    });
  }

  moduleRecursion =(children) =>{
    let dom ;
    if(children && children.length>0){
      dom = children.map(item => {
        return (
          <TreeNode icon={item.icon?<Icon type={item.icon} />:''} title={item.name} key={item.mcode} refs={item}> 
            {item.children&&item.children.length>0?this.moduleRecursion(item.children):undefined}
          </TreeNode>
        )
      })
    }
    return (dom);
  }

  handlerSelect = (selectedKeys,event) =>{
    this.setState({
      moduleDetail: event.node.props.refs,
      EnableShowEditCard:false,
      EnableShowAddCard:false,
      EnableShowViewCard:true,
    })
  }
 
  showEditCard = () =>{
    this.setState({
      EnableShowEditCard:true,
      EnableShowAddCard:false,
      EnableShowViewCard:false,
    })
  }

  showAddCard = () =>{
    this.setState({
      EnableShowEditCard:false,
      EnableShowAddCard:true,
      EnableShowViewCard:false,
    })
  }

  addDept = () =>{
    const { dispatch,form} = this.props;
    const { moduleDetail } = this.state;
    const that = this;
    form.validateFields(['addValues'], (err, fieldsValue) => {
      if (err) return;
      let payload ={...fieldsValue.addValues};
      if(moduleDetail.type===1){
        payload={...payload,appId:moduleDetail.id};
      }else{
        payload={...payload,appId:moduleDetail.appId,parentCode:moduleDetail.mcode};
      }
      dispatch({
        type: 'manaDept/deptAdd',
        payload,
      }).then(()=>{
        that.getDeptTree();
        that.setState({
          EnableShowEditCard:false,
          EnableShowAddCard:false,
          EnableShowViewCard:true,
        })
        form.resetFields(['addValues']);
      });
    })
  }

  editDept = () =>{
    const { dispatch,form} = this.props;
    const { moduleDetail } = this.state;
    const that = this;
    form.validateFields(['editValues'], (err, fieldsValue) => {
      if (err) return;
      const payload ={id:moduleDetail.id,...fieldsValue.editValues};
      dispatch({
        type: 'manaDept/deptEdit',
        payload,
      }).then(()=>{
        that.getDeptTree();
        that.setState({
          EnableShowEditCard:false,
          EnableShowAddCard:false,
          EnableShowViewCard:true,
        })
        form.resetFields(['editValues']);
      });
    })
  }

  removeDept = () =>{
    const { dispatch} = this.props;
    const { moduleDetail } = this.state;
    const that = this;
    const payload ={id:moduleDetail.id};
      dispatch({
        type: 'manaDept/deptRemove',
        payload,
      }).then(()=>{
        that.getDeptTree();
        that.setState({
          EnableShowEditCard:false,
          EnableShowAddCard:false,
          EnableShowViewCard:true,
        })
      });
  }

  render() {
    const { form, dispatch,manaDept:{deptTreeData} } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll } = form;
    const {moduleDetail,EnableShowViewCard,EnableShowEditCard,EnableShowAddCard} = this.state;
    const addDept = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'manaDept/submitDeptMana',
            payload: values,
          });
        }
      });
    };
    
    return (
      <PageHeaderWrapper title="部门管理" wrapperClassName={styles.advancedForm}>
        <Card className={styles.card} bordered={false}>
          <Row>
            <Col sm={24} md={8} lg={8}>
              <Card title="所有部门">
                <Search placeholder="Search" />
                <Tree
                  showIcon
                  showLine 
                  defaultSelectedKeys={['A']} 
                  defaultExpandedKeys={['A']}
                  onSelect={this.handlerSelect}
                >
                  {this.moduleRecursion(deptTreeData)}
                </Tree>
              </Card>
            </Col>
            <Col sm={24} md={16} lg={16}>
              {EnableShowViewCard ? (
                <Card title="部门查看" extra={<div>{moduleDetail.type===2?(<div><Button onClick={this.showEditCard}>编 辑</Button> <Button onClick={this.removeDept}>删 除</Button></div>):''} <Button onClick={this.showAddCard}>新增下级部门</Button></div>}>
                  <Form layout="horizontal" onSubmit={addDept}>
                    <Row gutter={10}>
                      <Col>
                        <Form.Item {...formItemLayout} label="部门名称">
                          {moduleDetail.name}
                        </Form.Item>
                      </Col>
                      <Col>
                        <Form.Item {...formItemLayout} label="代码">
                          {moduleDetail.mcode}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Item {...formItemLayout} label='排序号'>
                          {moduleDetail.sortNo}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Card>)
              :''}
              {EnableShowEditCard?(
                <Card title="部门编辑" extra={<Button onClick={this.editDept}>保 存</Button>}>
                  <Form layout="horizontal">
                    <Row gutter={10}>
                      <Col>
                        <Form.Item {...formItemLayout} label="部门名称">
                          {getFieldDecorator('editValues.name', {
                            rules: [{ required: true, message: `请填写部门名称` }],
                            initialValue:moduleDetail.name,
                          })(<Input style={{ width: '240px' }} placeholder="请输入" />)}
                        </Form.Item>
                      </Col>
                      <Col>
                        <Form.Item {...formItemLayout} label="代码">
                          {getFieldDecorator('editValues.mcode', {
                            rules: [{ required: true, message: `请填写部门代码` }],
                            initialValue:moduleDetail.mcode,
                          })(<Input style={{ width: '240px' }} placeholder="请输入" />)}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Item {...formItemLayout} label='排序号'>
                          {getFieldDecorator('editValues.sortNo', {
                            initialValue:moduleDetail.sortNo,
                          })(<InputNumber style={{ width: '240px' }} placeholder="请输入" />)}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Card>)
              :''}
              {EnableShowAddCard?(
                <Card title="部门新增" extra={<Button onClick={this.addDept}>保 存</Button>}>
                  <Form layout="horizontal">
                    <Row gutter={10}>
                      <Col>
                        <Form.Item {...formItemLayout} label="部门名称">
                          {getFieldDecorator('addValues.name', {
                            rules: [{ required: true, message: `请填写部门名称` }],
                          })(<Input style={{ width: '240px' }} placeholder="请输入" />)}
                        </Form.Item>
                      </Col>
                      <Col>
                        <Form.Item {...formItemLayout} label="代码">
                          {getFieldDecorator('addValues.mcode', {
                            rules: [{ required: true, message: `请填写部门代码` }],
                          })(<Input style={{ width: '240px' }} placeholder="请输入" />)}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Item {...formItemLayout} label='排序号'>
                          {getFieldDecorator('addValues.sortNo', {
                          })(<InputNumber style={{ width: '240px' }} placeholder="请输入" />)}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Card>)
                :''}
            </Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default DeptMana;