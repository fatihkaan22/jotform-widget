import React from 'react';
import './style.css';

export const Grid = ({ size }) => {
  return (
    <div
      className="Grid"
      style={{
        '--grid-size': `${size}px`
      }}
    />
  );
};
