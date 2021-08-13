import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Draggable } from '../../Draggable';

const DraggableItem = ({ label, style, translate, innerComponent }) => {
  const { attributes, isDragging, listeners, setNodeRef } = useDraggable({
    id: 'draggable'
  });

  return (
    <Draggable
      ref={setNodeRef}
      dragging={isDragging}
      label={label}
      listeners={listeners}
      style={style}
      translate={translate}
      innerComponent={innerComponent}
      {...attributes}
    />
  );
};

export default DraggableItem;
