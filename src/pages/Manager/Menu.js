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
import styles from './Menu.less';

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
  menuMana: state.menuMana,
}))
@Form.create()
class MenuMana extends PureComponent {
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
      type: 'menuMana/fetch',
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

  getMenuTree = () =>{
    const { dispatch} = this.props;
    dispatch({
      type: 'menuMana/fetch',
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

  addMenu = () =>{
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
        type: 'menuMana/menuAdd',
        payload,
      }).then(()=>{
        that.getMenuTree();
        that.setState({
          EnableShowEditCard:false,
          EnableShowAddCard:false,
          EnableShowViewCard:true,
        })
        form.resetFields(['addValues']);
      });
    })
  }

  editMenu = () =>{
    const { dispatch,form} = this.props;
    const { moduleDetail } = this.state;
    const that = this;
    form.validateFields(['editValues'], (err, fieldsValue) => {
      if (err) return;
      const payload ={id:moduleDetail.id,...fieldsValue.editValues};
      dispatch({
        type: 'menuMana/menuEdit',
        payload,
      }).then(()=>{
        that.getMenuTree();
        that.setState({
          EnableShowEditCard:false,
          EnableShowAddCard:false,
          EnableShowViewCard:true,
        })
        form.resetFields(['editValues']);
      });
    })
  }

  removeMenu = () =>{
    const { dispatch} = this.props;
    const { moduleDetail } = this.state;
    const that = this;
    const payload ={id:moduleDetail.id};
      dispatch({
        type: 'menuMana/menuRemove',
        payload,
      }).then(()=>{
        that.getMenuTree();
        that.setState({
          EnableShowEditCard:false,
          EnableShowAddCard:false,
          EnableShowViewCard:true,
        })
      });
  }

  render() {
    const { form, dispatch,menuMana:{menuTreeData} } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll } = form;
    const {moduleDetail,EnableShowViewCard,EnableShowEditCard,EnableShowAddCard} = this.state;
    const addMenu = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'menuManaEdit/submitMenuMana',
            payload: values,
          });
        }
      });
    };
    
    return (
      <PageHeaderWrapper title="系统菜单管理" wrapperClassName={styles.advancedForm}>
        <Card className={styles.card} bordered={false}>
          <Row>
            <Col sm={24} md={8} lg={8}>
              <Card title="所有菜单">
                <Search placeholder="Search" />
                <Tree
                  showIcon
                  showLine 
                  defaultSelectedKeys={['A']} 
                  defaultExpandedKeys={['A']}
                  onSelect={this.handlerSelect}
                >
                  {this.moduleRecursion(menuTreeData)}
                </Tree>
              </Card>
            </Col>
            <Col sm={24} md={16} lg={16}>
              {EnableShowViewCard ? (
                <Card title="菜单查看" extra={<div>{moduleDetail.type===2?(<div><Button onClick={this.showEditCard}>编 辑</Button> <Button onClick={this.removeMenu}>删 除</Button></div>):''} <Button onClick={this.showAddCard}>新增下级菜单</Button></div>}>
                  <Form layout="horizontal" onSubmit={addMenu}>
                    <Row gutter={10}>
                      <Col>
                        <Form.Item {...formItemLayout} label="菜单名称">
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
                        <Form.Item {...formItemLayout} label='代码路径'>
                          {moduleDetail.mcodePath}
                        </Form.Item>
                      </Col>
                      <Col>
                        <Form.Item {...formItemLayout} label='URI'>
                          {moduleDetail.uri}
                        </Form.Item>
                      </Col>
                      <Col>
                        <Form.Item {...formItemLayout} label='是否末节点'>
                          {moduleDetail.isLeaf===1?'是':'否'}
                        </Form.Item>
                      </Col>
                      <Col>
                        <Form.Item {...formItemLayout} label='排序号'>
                          {moduleDetail.sortNo}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Item {...formItemLayout} label='菜单等级'>
                          {moduleDetail.level}
                        </Form.Item>
                      </Col>
                      <Col>
                        <Form.Item {...formItemLayout} label='菜单图标'>
                          {moduleDetail.icon}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Card>)
              :''}
              {EnableShowEditCard?(
                <Card title="菜单编辑" extra={<Button onClick={this.editMenu}>保 存</Button>}>
                  <Form layout="horizontal">
                    <Row gutter={10}>
                      <Col>
                        <Form.Item {...formItemLayout} label="菜单名称">
                          {getFieldDecorator('editValues.name', {
                            rules: [{ required: true, message: `请填写菜单名称` }],
                            initialValue:moduleDetail.name,
                          })(<Input style={{ width: '240px' }} placeholder="请输入" />)}
                        </Form.Item>
                      </Col>
                      <Col>
                        <Form.Item {...formItemLayout} label="代码">
                          {getFieldDecorator('editValues.mcode', {
                            rules: [{ required: true, message: `请填写菜单代码` }],
                            initialValue:moduleDetail.mcode,
                          })(<Input style={{ width: '240px' }} placeholder="请输入" />)}
                        </Form.Item>
                      </Col>
                      <Col>
                        <Form.Item {...formItemLayout} label="URI">
                          {getFieldDecorator('editValues.uri', {
                            rules: [{ required: true, message: `请填写菜单URI` }],
                            initialValue:moduleDetail.uri,
                          })(<Input style={{ width: '240px' }} placeholder="请输入" />)}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Item {...formItemLayout} label='是否末节点'>
                          {getFieldDecorator('editValues.isLeaf', {
                            initialValue:moduleDetail.isLeaf,
                          })(
                            <RadioGroup>
                              <Radio value={0}>不是</Radio>
                              <Radio value={1}>是</Radio>
                            </RadioGroup>
                          )}
                        </Form.Item>
                      </Col>
                      <Col>
                        <Form.Item {...formItemLayout} label='排序号'>
                          {getFieldDecorator('editValues.sortNo', {
                            initialValue:moduleDetail.sortNo,
                          })(<InputNumber style={{ width: '240px' }} placeholder="请输入" />)}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Item {...formItemLayout} label='菜单图标'>
                          {getFieldDecorator('editValues.icon', {
                            initialValue:moduleDetail.icon,
                          })(<Input style={{ width: '240px' }} placeholder="请输入" />)}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Card>)
              :''}
              {EnableShowAddCard?(
                <Card title="菜单新增" extra={<Button onClick={this.addMenu}>保 存</Button>}>
                  <Form layout="horizontal">
                    <Row gutter={10}>
                      <Col>
                        <Form.Item {...formItemLayout} label="菜单名称">
                          {getFieldDecorator('addValues.name', {
                            rules: [{ required: true, message: `请填写菜单名称` }],
                          })(<Input style={{ width: '240px' }} placeholder="请输入" />)}
                        </Form.Item>
                      </Col>
                      <Col>
                        <Form.Item {...formItemLayout} label="代码">
                          {getFieldDecorator('addValues.mcode', {
                            rules: [{ required: true, message: `请填写菜单代码` }],
                          })(<Input style={{ width: '240px' }} placeholder="请输入" />)}
                        </Form.Item>
                      </Col>
                      <Col>
                        <Form.Item {...formItemLayout} label="URI">
                          {getFieldDecorator('addValues.uri', {
                            rules: [{ required: true, message: `请填写菜单URI` }],
                          })(<Input style={{ width: '240px' }} placeholder="请输入" />)}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Item {...formItemLayout} label='是否末节点'>
                          {getFieldDecorator('addValues.isLeaf', {
                            initialValue:1,
                          })(
                            <RadioGroup>
                              <Radio value={0}>不是</Radio>
                              <Radio value={1}>是</Radio>
                            </RadioGroup>
                          )}
                        </Form.Item>
                      </Col>
                      <Col>
                        <Form.Item {...formItemLayout} label='排序号'>
                          {getFieldDecorator('addValues.sortNo', {
                          })(<InputNumber style={{ width: '240px' }} placeholder="请输入" />)}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Form.Item {...formItemLayout} label='菜单图标'>
                          {getFieldDecorator('addValues.icon', {
                          })(<Input style={{ width: '240px' }} placeholder="请输入" />)}
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

export default MenuMana;