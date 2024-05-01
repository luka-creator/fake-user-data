import React from 'react';
import '../App.css';
const DataTable = ({ data, onScroll }) => {
  return (
    <div className="data-table" onScroll={onScroll} style={{ height: '300px', overflowY: 'scroll' }}>
      {data.map((record) => (
        <div key={record.identifier}>
          <span>{record.index}.</span>
          <span>{record.identifier}</span>
          <span>{record.name}</span>
          <span>{record.address}</span>
          <span>{record.phone}</span>
        </div>
      ))}
    </div>
  );
};

export default DataTable;