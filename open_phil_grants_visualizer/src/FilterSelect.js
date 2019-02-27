import React from 'react';
import { Select } from 'semantic-ui-react';

const FilterSelect = ({ options, placeholder }) => (
  <Select placeholder={placeholder} options={options} />
);

export default FilterSelect;
