import React, { Component } from 'react';
import { Select, Input } from 'semantic-ui-react';

class FiltersPanel extends Component {
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
        {this.props.filtersMenuData && <Select
          placeholder='Organization'
          options={this.props.filtersMenuData.distinctOrgs}
          onChange={this.filterBySelectedOption}
        />}
        {this.props.filtersMenuData && <Select
          placeholder='Focus Area'
          options={this.props.filtersMenuData.distinctFocusAreas}
          onChange={this.filterBySelectedOption}
        />}
        {this.props.filtersMenuData && <Select
          placeholder='Year'
          options={this.props.filtersMenuData.distinctYears}
          onChange={this.filterBySelectedOption}
        />}
        <Input
          onChange={this.filterBySearch}
          type='text'
          placeholder='search' />
      </div>
    );
  }
}

export default FiltersPanel;
