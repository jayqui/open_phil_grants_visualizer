import React, { Component } from 'react';
import FilterSelect from './FilterSelect';

class FiltersPanel extends Component {
  distinctFocusAreas = () => {
    return [...new Set(this.props.data
      .map(datum => datum["Focus Area"]))]
      .sort();
  }
  distinctYears = () => {
    return [...new Set(this.props.data
      .map(datum => datum["Date"].match(/(\d+)\/(\d+)/)[1]))]
      .sort((a, b) => b - a);
  }
  distinctOrgs = () => {
    return [...new Set(this.props.data
      .map(datum => datum["Organization Name"].trim()))]
      .sort();
  }

  render() {
    return(
      <div>
        <FilterSelect
          placeholder='Organization'
          options={this.distinctOrgs().map(item => ({ text: item, value: item }))}
        />
        <FilterSelect
          placeholder='Year'
          options={this.distinctYears().map(item => ({ text: item, value: item }))}
        />
        <FilterSelect
          placeholder='Focus Area'
          options={this.distinctFocusAreas().map(item => ({ text: item, value: item }))}
        />
      </div>
    );
  }
}

export default FiltersPanel;
