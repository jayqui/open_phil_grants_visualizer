import React, { Component } from 'react';
import * as d3 from 'd3-fetch';
import FilterSelect from './FilterSelect';

class App extends Component {
  state = {
    data: [],
  }

  componentDidMount() {
    // FOR PRODUCTION
    // d3.csv('https://www.openphilanthropy.org/giving/grants/spreadsheet').then(data => {

    // TEMP FOR DEVELOPMENT
    d3.csv('/giving/grants/spreadsheet').then(data => {
      this.setState({ data });
    });
  }

  grantsTotal = () => {
    if (!this.state.data.length) { return; }
    const subtotal = this.state.data.reduce((accum, current) =>
        accum + Number(current["Amount"].replace(/[^0-9.-]+/g,"")),
      0);


    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(subtotal);
  }

  distinctFocusAreas = () => {
    return [...new Set(this.state.data
      .map(datum => datum["Focus Area"]))]
      .sort();
  }

  distinctYears = () => {
    return [...new Set(this.state.data
      .map(datum => datum["Date"].match(/(\d+)\/(\d+)/)[2]))]
      .sort();
  }

  distinctOrgs = () => {
    return [...new Set(this.state.data
      .map(datum => datum["Organization Name"].trim()))]
      .sort();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div>
            <h3>Grants count: {this.state.data.length}</h3>
            <h3>Grants total: {this.grantsTotal()}</h3>
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
            {this.state.data.length && this.state.data.map(datum => (
              <div key={`${datum["Grant"]}${datum["Date"]}`}>
                <h3>{datum["Grant"]}</h3>
                <p>{datum["Organization Name"]}</p>
                <p>{datum["Focus Area"]}</p>
                <p>{datum["Amount"]}</p>
                <p>{datum["Date"]}</p>
              </div>
            ))}
          </div>
        </header>
      </div>
    );
  }
}

export default App;
