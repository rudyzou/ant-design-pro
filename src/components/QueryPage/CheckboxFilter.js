import React, { Component } from 'react';
import { Checkbox } from 'antd';
import PropTypes from 'prop-types';

const CheckboxGroup = Checkbox.Group;
class CheckboxFilter extends Component{
    static propTypes = {
        onChange:PropTypes.func,
        value:PropTypes.array || PropTypes.string,
        options:PropTypes.array,
        disabledMultipleCheck:PropTypes.bool,

      }
    
      static defaultProps={
        onChange:()=>{},
        value:[],
        options:[],
        disabledMultipleCheck:false,
      }

      static getDerivedStateFromProps(nextProps, prevState) {
          let rt = null
        if (nextProps.value.length !== prevState.value.length) {
            rt = {
                value: nextProps.value,
            };
        } else if(nextProps.value.length===1&&prevState.value.length===1&&nextProps.value[0] !== prevState.value[0]){
            rt = {
                value: nextProps.value,
            };
        }
        return rt;
      }

      constructor(props) {
        super(props);
    
        const value = props.value || [];
        const disabledMultipleCheck = props.disabledMultipleCheck || false;
        this.state = {
            value:disabledMultipleCheck?"":value,
            checkAll:false,
        };
      }

      triggerChange = changedValue => {
        // Should provide an event to pass value to Form.
        const {onChange} = this.props;
        this.setState({
            value:changedValue,
        })
        const {value} = this.state
        if (onChange) {
          onChange(value);
        }
      };

      checkboxGroupChangeHandl = (checkedList) =>{
        const {options,disabledMultipleCheck} = this.props
        this.setState({
            value:disabledMultipleCheck?checkedList[checkedList.length-1]:checkedList,
            indeterminate: !!checkedList.length && checkedList.length < options.length,
            checkAll: checkedList.length === options.length,
          });
      }

      plainOptions = options => {
          return options.map(item=>item.value)
      }

      onCheckAllChange = (e) =>{
        const {options} = this.props
        this.setState({
        value: e.target.checked ? this.plainOptions(options) : [],
        indeterminate: false,
        checkAll: e.target.checked,
        });
      }

      render() {
        const { options,disabledMultipleCheck} = this.props;
        const {value,checkAll,indeterminate} = this.state
        return (
          <div>
            {
                disabledMultipleCheck?
                (
                  <Checkbox
                    indeterminate={indeterminate}
                    onChange={this.onCheckAllChange}
                    checked={checkAll}
                  >
                    全选
                  </Checkbox>
                )
                :''
            }
            
            <CheckboxGroup
              options={options}
              value={disabledMultipleCheck?[value]:value}
              onChange={this.checkboxGroupChangeHandl}
            />
          </div>
        );
      }
}

export default CheckboxFilter;