import React, { Component } from 'react';
import * as d3 from 'd3-fetch';
import MaterialTable from 'material-table';

import FiltersPanel from './FiltersPanel';
import SpinnerSection from './SpinnerSection';

import './App.css'

class App extends Component {
  state = {
    data: [],
  }

  componentDidMount() {
    // PROXY PATH FOR DEVLEOPMENT
    // const grantsDbUrl = 'https://www.openphilanthropy.org/giving/grants/spreadsheet'; // CORS issue in dev
    const grantsDbUrl = '/giving/grants/spreadsheet';
    d3.csv(grantsDbUrl).then(dirtyData => {
      const data = dirtyData.map((datum => {
        datum['Date'] = this.reformatDate(datum['Date']);
        datum['Amount'] = this.reformatAmount(datum['Amount']);
        return datum;
      }));
      this.setState({ data });
    });
  }

  reformatDate = (dateString) => {
    const dateMatchGroups = dateString.match(/(\d+)\/(\d+)/);
    const year = dateMatchGroups[2];
    const month = dateMatchGroups[1].length === 1 ? `0${dateMatchGroups[1]}` : dateMatchGroups[1];
    return `${year}/${month}`;
  }

  reformatAmount = (amountString) => {
    return Number(amountString.replace(/[^0-9.-]+/g,''));
  }

  grantsTotal = () => {
    if (!this.state.data.length) { return; }
    const subtotal = this.state.data.reduce((accum, current) =>
      accum + Number(current['Amount']), 0);
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(subtotal);
  }

  render() {
    return (
      <div className='App'>
        <header className='App-header'>
          <div>
            <h3>Grants count: {this.state.data.length}</h3>
            <h3>Grants total: {this.grantsTotal()}</h3>
            <FiltersPanel data={this.state.data} />
            {!this.state.data.length && <SpinnerSection />}
            <div>
              {this.state.data.length && <MaterialTable
                title='Grants'
                options={{ pageSize: 25, pageSizeOptions: [10, 25, 50, 100, this.state.data.length] }}
                columns={[
                  { title: 'Grant Title', field: 'Grant' },
                  { title: 'Organization', field: 'Organization Name' },
                  { title: 'Focus Area', field: 'Focus Area' },
                  { title: 'Date', field: 'Date', type: 'date' },
                  { title: 'Amount', field: 'Amount', type: 'currency' },
                ]}
                data={this.state.data}
              />}
            </div>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
