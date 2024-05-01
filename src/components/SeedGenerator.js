import React from 'react';

const SeedGenerator = ({ seed, onSeedChange, onRandomSeed }) => {
  const handleInputChange = (event) => {
    onSeedChange(Number(event.target.value));
  };

  return (
    <div class='margin'>
      <input
        type="number"
        min="0"
        max="1000000"
        value={seed}
        onChange={handleInputChange}
      />
      <button onClick={onRandomSeed}>Random</button>
    </div>
  );
};

export default SeedGenerator;