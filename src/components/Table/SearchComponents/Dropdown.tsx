import React from 'react'
import { Select } from 'antd';
import _ from 'lodash'
const { Option } = Select;

class FilterDropdown extends React.Component<any, any> {
  refInput: any
  state = {
    values: _.get(this.props.column,"filteredValue[0].value", [])
  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps.column.filteredValue) != JSON.stringify(this.props.column.filteredValue)) {
      let values = _.get(this.props.column,"filteredValue[0].value", [])
      this.setState({
        values: values
      })
    }
  }

  onChange = (values) => {
    if (this.props.mode === "single") {
      values = values != null? [values]: []
    }
    this.setState({ values: values })
  }

  onSubmit = () => {
    const { column, confirm } = this.props
    let filters = [];
    if (this.state.values && this.state.values.length > 0) {
      filters = [{
        field: column.field,
        operator: this.props.operator || 'in',
        value: this.state.values
      }]
      /* filters = this.state.values.map(value => ({
        field: column.field,
        operator: this.props.operator || '=',
        value: value
      })) */
    }
    confirm(filters)
  }

  renderOptions() {
    if(!this.props.options) return
    return this.props.options.map(option => <Option key={option.value} value={option.value} label={option.label} >{option.label}</Option>)
  }

  render() {
    const { confirm, column, options, searchBtnText, clearBtnText, ...otherProps } = this.props
    return <div style={{ padding: 8 }}>
      <Select
        mode="multiple"
        {...otherProps}
        allowClear={true}
        ref={ref => this.refInput = ref}
        value={this.state.values}
        onChange={this.onChange}
        //onBlur={this.onSubmit}
        optionFilterProp="label"
        style={{ width: '250px', marginBottom: 8, display: "block" }}
        defaultValue={[]}
      >
          {this.renderOptions()}
      </Select>
    </div>
  }
}

export default FilterDropdown as any
