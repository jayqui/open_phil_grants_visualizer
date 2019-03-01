import React from 'react';
import MaterialTable from 'material-table';

const DataTable = ({ data }) => {
  const columns = [
    { title: 'Grant Title', field: 'Grant' },
    { title: 'Organization', field: 'Organization Name' },
    { title: 'Focus Area', field: 'Focus Area' },
    { title: 'Date', field: 'Date', type: 'date' },
    { title: 'Amount', field: 'Amount', type: 'currency' },
  ];
  const options = {
    search: false,
    pageSize: 25,
    pageSizeOptions: [10, 25, 50, 100, data.length],
  };

  return(
    <MaterialTable
      title=''
      options={options}
      columns={columns}
      data={data}
    />
  );
}

export default DataTable;
