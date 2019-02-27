import React from 'react';
import './GrantRow.css'

const GrantRow = ({ grant, odd }) => (
  <div className="GrantRow" key={`${grant["Grant"]}${grant["Date"]}`}>
    <h3>{grant["Grant"]}</h3>
    <p>{grant["Organization Name"]}</p>
    <p>{grant["Focus Area"]}</p>
    <p>{grant["Amount"]}</p>
    <p>{grant["Date"]}</p>
  </div>
);

export default GrantRow;
