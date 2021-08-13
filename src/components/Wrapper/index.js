import React from 'react';
import './style.css';

export const Wrapper = ({ children, center, style }) => {
  return (
    <div className={`Wrapper ${center ? 'center' : ''}`} style={style}>
      {children}
    </div>
  );
};
