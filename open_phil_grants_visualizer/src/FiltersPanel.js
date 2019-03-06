import React, { Component } from 'react';
import { Select, Input } from 'semantic-ui-react';

class FiltersPanel extends Component {
  distinctFocusAreas = () => {
    return [...new Set(this.props.allData
      .map(datum => datum["Focus Area"]))]
      .sort();
  }
  distinctYears = () => {
    return [...new Set(this.props.allData
      .map(datum => datum["Date"].match(/(\d+)\/(\d+)/)[1]))]
      .sort((a, b) => b - a);
  }
  distinctOrgs = () => {
    return [...new Set(this.props.allData
      .map(datum => datum["Organization Name"].trim()))]
      .sort();
  }

  filterBySelectedOption = (_value, text) => {
    this.props.applyFilters(text.placeholder, text.value);
  }

  filterBySearch = (event) => {
    event.preventDefault();
    this.props.applyFilters('search', event.target.value);
  }

  render() {
    return(
      <div>
        <Select
          placeholder='Organization'
          options={this.distinctOrgs().map(item => ({ text: item, value: item }))}
          onChange={this.filterBySelectedOption}
        />
        <Select
          placeholder='Focus Area'
          options={this.distinctFocusAreas().map(item => ({ text: item, value: item }))}
          onChange={this.filterBySelectedOption}
        />
        <Select
          placeholder='Year'
          options={this.distinctYears().map(item => ({ text: item, value: item }))}
          onChange={this.filterBySelectedOption}
        />
        <Input
          onChange={this.filterBySearch}
          type='text'
          placeholder='search' />
      </div>
    );
  }
}

export default FiltersPanel;
