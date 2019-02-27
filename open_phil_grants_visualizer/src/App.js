import React, { Component } from 'react';
import * as d3 from 'd3-fetch';

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

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div>
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
