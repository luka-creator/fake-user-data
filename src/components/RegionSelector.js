import React from 'react';

const RegionSelector = ({ region, regions, onRegionChange }) => {
  const handleChange = (e) => {
    onRegionChange(e.target.value);
  };

  return (
    <select value={region} onChange={handleChange}>
      {regions.map((r) => (
        <option key={r} value={r}>
          {r}
        </option>
      ))}
    </select>
  );
};

export default RegionSelector;