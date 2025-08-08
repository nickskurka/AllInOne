import React, { useState } from 'react';

const OptionChart = ({ data, mode }) => {
  const [selectedGreek, setSelectedGreek] = useState('delta');
  if (!data || data.length === 0) return null;

  const maxCallPrice = Math.max(...data.map(d => d.call.price));
  const maxPutPrice = Math.max(...data.map(d => d.put.price));
  const maxPrice = Math.max(maxCallPrice, maxPutPrice);
  const minPrice = Math.min(...data.map(d => Math.min(d.call.price, d.put.price)));

  // Greek ranges for right chart
  const maxCallGreek = Math.max(...data.map(d => d.call[selectedGreek]));
  const minCallGreek = Math.min(...data.map(d => d.call[selectedGreek]));
  const maxPutGreek = Math.max(...data.map(d => d.put[selectedGreek]));
  const minPutGreek = Math.min(...data.map(d => d.put[selectedGreek]));
  const maxGreek = Math.max(maxCallGreek, maxPutGreek);
  const minGreek = Math.min(minCallGreek, minPutGreek);

  const chartHeight = 600;
  const chartWidth = 400; // Each chart gets half the width
  const padding = 60;
  const rightPadding = 20;

  const greekOptions = [
    { key: 'delta', label: 'Delta', format: (val) => val.toFixed(3) },
    { key: 'gamma', label: 'Gamma', format: (val) => val.toFixed(4) },
    { key: 'theta', label: 'Theta', format: (val) => val.toFixed(3) },
    { key: 'vega', label: 'Vega', format: (val) => val.toFixed(3) },
    { key: 'rho', label: 'Rho', format: (val) => val.toFixed(3) }
  ];

  const selectedGreekInfo = greekOptions.find(g => g.key === selectedGreek);

  return (
    // ...existing OptionChart JSX code...
    <div>OptionChart code here (omitted for brevity)</div>
  );
};

export default OptionChart;
