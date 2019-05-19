import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Icon,
  Button,
} from 'antd';
import QueryPage from '@/components/QueryPage';
import Highlighter from "react-highlight-words";



/* eslint react/no-multi-comp:0 */
@connect(({ dynamicList, loading }) => ({
  dynamicList,
  loading: loading.models.dynamicList,
}))
@Form.create()
class DynamicList extends PureComponent {
  state = {
    searchText:'',
  };

  componentDidMount() {
    const { dispatch,match} = this.props;
    const {params:{pageId}} = match 
    dispatch({
      type: 'dynamicList/getPageSetting',
      payload:{
        pageId,
      },
      cabk:(response)=>{
        dispatch({
          type: 'dynamicList/fetch',
          payload:{
            queryUrl:response.pageSettings.queryUrl,
            data:null,
          },
        });
      }
    });
   
  }

  handleStandardTableChange = (params) => {
    const { dispatch,dynamicList:{pageSettings:{queryUrl}}  } = this.props;
    dispatch({
      type: 'dynamicList/fetch',
      payload:{
        queryUrl,
        data:params,
      },
    });
  };

  getColumnSearchProps = (dataIndex) => {
    const {searchText} = this.state
    return ({
      filterDropdown: ({
        setSelectedKeys, selectedKeys, confirm, clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={node => { this.searchInput = node; }}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm)}
            icon="search"
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            搜索
          </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            重置
          </Button>
        </div>
      ),
      filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          setTimeout(() => this.searchInput.select());
        }
      },
      render: (text) => (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ),
    })
  } 

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  }

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: '' });
  }



  render() {
    const {
      dynamicList: { data,pageSettings:{title,columns,filters} },
      loading,
    } = this.props;

    return (
      <QueryPage 
        title={title} 
        rowKey='id'
        filters={filters}
        loading={loading}
        data={data}
        columns={columns}
        onQuerySubmit={this.handleStandardTableChange}
      
      />
    );
  }
}

export default DynamicList;
