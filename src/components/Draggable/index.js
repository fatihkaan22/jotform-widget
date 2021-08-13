import React, { forwardRef } from 'react';
import { getTranslateStyle } from '../SeatingPlan/Seat/utils';
import './style.css';

export const Draggable = forwardRef(function Draggable(
  {
    dragOverlay,
    dragging,
    label,
    listeners,
    translate,
    innerComponent,
    ...props
  },
  ref
) {
  const draggableStyle = getTranslateStyle(translate);

  return (
    <div
      className={`
        Draggable 
        ${dragOverlay ? 'dragOverlay' : ''} 
        ${dragging ? 'dragging' : ''}
`}
      style={draggableStyle}
    >
      <button
        ref={ref}
        aria-label="Draggable"
        data-cypress="draggable-item"
        {...listeners}
        tabIndex={undefined}
        {...props}
      >
        {innerComponent.component}
      </button>
      {/* {label ? <label>{label}</label> : null} */}
    </div>
  );
});
