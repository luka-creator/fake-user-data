import React from 'react';

const ErrorControls = ({ errors, onErrorsChange }) => {
  const handleSliderChange = (e) => {
    onErrorsChange(e.target.value);
  };

  const handleInputChange = (e) => {
    const value = Math.min(e.target.value, 1000);
    onErrorsChange(value);
  };

  return (
    <>
      <label>Errors:</label>
      <input
        type="range"
        min="0"
        max="10"
        step="0.5"
        value={errors}
        onChange={handleSliderChange}
      />
      <input
        type="number"
        min="0"
        max="1000"
        value={errors}
        onChange={handleInputChange}
      />
    </>
  );
};

export default ErrorControls;