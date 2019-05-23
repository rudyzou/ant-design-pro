import React, { PureComponent } from 'react';
import {
  Card,
  Form,
  Input,
  Icon,
  Button,
  Col,
  Row,
  Select,
  InputNumber,
  DatePicker,
  AutoComplete,
} from 'antd';
import PropTypes from 'prop-types';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import CheckboxFilter from './CheckboxFilter';
import styles from './index.less';


const {Option} = Select
const FormItem = Form.Item;
const {RangePicker} = DatePicker;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@Form.create()
class QueryPage extends PureComponent {

  static propTypes = {
    title: PropTypes.string,
    rowKey:PropTypes.string,
    filters: PropTypes.array,
    columns: PropTypes.array,
    onQuerySubmit:PropTypes.func,
    data:PropTypes.object,
    loading:PropTypes.bool,
    getBatchOperationButtons:PropTypes.func,
    getOperationButtons:PropTypes.func,
    otherTableProps:PropTypes.object,
  }

  static defaultProps={
    title: '',
    rowKey:'id',
    filters: [],
    columns: [],
    onQuerySubmit:()=>{},
    data:{
      list:[],
      pageSize:{},
    },
    loading:false,
    getBatchOperationButtons:null,
    getOperationButtons:null,
    otherTableProps:{},
  }

  state = {
    expandForm: false,
    formValues: {},
    selectedRows: [],
  };

  componentDidMount() {
   
  }

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { onQuerySubmit } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    if(onQuerySubmit) onQuerySubmit(params);
  };

  handleFormReset = () => {
    const { form, onQuerySubmit} = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    onQuerySubmit({});
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { form,onQuerySubmit} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };

      this.setState({
        formValues: values,
      });
      onQuerySubmit(values)
    });
  };

  getComp =  (filter) =>{
    let comp = null;
    let componentProps = {}
    switch (filter.type) {
      case 'input':
        componentProps = filter.componentProps? filter.componentProps:{}
        comp =<Input {...componentProps} placeholder={`请输入${filter.label}`} style={{ width: '200px' }} />
        break;
      case 'select':
        componentProps = filter.componentProps? filter.componentProps:{}
        comp =(
          <Select {...componentProps} placeholder={`请选择${filter.label}`} style={{ width: '200px' }}>
            {filter.options?filter.options.map(item => <Option value={item.value} key={`option_key_${item.value}_${filter.dataIndex}`}>{item.name}</Option>):''}
          </Select>
        )
      break;

      case 'number':
        componentProps = filter.componentProps? filter.componentProps:{}
        comp =<InputNumber {...componentProps} placeholder={`请输入${filter.label}`} style={{ width: '200px' }} />
      break;

      case 'datePicker':
        componentProps = filter.componentProps? filter.componentProps:{}
        comp =<DatePicker {...componentProps} style={{ width: '200px' }} />
      break;

      case 'dataRange':
        componentProps = filter.componentProps? filter.componentProps:{}
        comp =  <RangePicker {...componentProps} style={{ width: '200px' }} />
      break;

      case 'autoComplete':
        componentProps = filter.componentProps? filter.componentProps:{}
        comp = (
          <AutoComplete
            {...componentProps}
            dataSource={filter.options}
            placeholder={`请搜索${filter.label}`}
          >
            <Input suffix={<Icon type="search" className="certain-category-icon" />} />
          </AutoComplete>
          )
      break;
      
      case 'treeSelect':
      break;

      case 'numberRange':
      break;

      case 'cascader':
      break;

      default :
        break;
    }
    return comp;
  }

  renderSimpleForm() {
    const {
      form: { getFieldDecorator }, filters,
    } = this.props;
    const filtersSize = filters.length;
    return (
      filtersSize > 0?
        <Form onSubmit={this.handleSearch} layout="inline">
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
              <FormItem label={filters[0].label}>
                {getFieldDecorator(filters[0].dataIndex)(this.getComp(filters[0]))}
              </FormItem>
            </Col>
            {filtersSize > 1?
              <Col md={8} sm={24}>
                <FormItem label={filters[1].label}>
                  {getFieldDecorator(filters[1].dataIndex)(this.getComp(filters[1]))}
                </FormItem>
              </Col>
            :''
            }
            <Col md={8} sm={24}>
              <span className={styles.submitButtons}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                  重置
                </Button>
                {
                  filtersSize>2?
                    <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                      展开 <Icon type="down" />
                    </a>
                  :''
                }
              </span>
            </Col>
          </Row>
        </Form>
      : <div />
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },filters,
    } = this.props;
    const filtersSize = filters.length;
    const filterRowSize = Math.ceil(filtersSize/3);
    const filterRow = new Array(filterRowSize);
    let count = 0;
    // eslint-disable-next-line no-plusplus
    for(let j=0; j<filterRowSize; j++){
      const row = [];
      // eslint-disable-next-line no-plusplus
      for(let i=0; i<3; i++){
        if(count < filtersSize){
          row.push(count)
          // eslint-disable-next-line no-plusplus
          count ++ ;
        }else{
          break;
        }
      }
      filterRow.push(row);
    }
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        {
          filterRow.map((r) => {
            return (
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                {
                  r.map(i=>(
                    <Col md={8} sm={24} key={`key_col_${filters[i].dataIndex}`}>
                      <FormItem label={filters[i].label}>
                        {getFieldDecorator(`${filters[i].dataIndex}`)(this.getComp(filters[i]))}
                      </FormItem>
                    </Col>
                  ))
                }
              </Row>
            )
          })
        }
        <div style={{ overflow: 'hidden' }}>
          <div style={{ marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }


  render() {
    const {
      data,
      loading,
      title,
      columns,
      getBatchOperationButtons,
      getOperationButtons,
      rowKey,
      otherTableProps,
    } = this.props;
    const {selectedRows} = this.state

    return (
      <PageHeaderWrapper title={title}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              {getOperationButtons?getOperationButtons():''}
              {selectedRows.length > 0 && (
                <span>
                  {getBatchOperationButtons?getBatchOperationButtons(selectedRows):''}
                </span>
              )}
            </div>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator} />
            <StandardTable
              rowKey={rowKey}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={getBatchOperationButtons?this.handleSelectRows:null}
              onChange={this.handleStandardTableChange}
              {...otherTableProps}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default QueryPage;
