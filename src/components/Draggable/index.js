import React, { forwardRef } from "react";
import "./Draggable.css";

export const Draggable = forwardRef(function Draggable(
  {
    axis,
    dragOverlay,
    dragging,
    handle,
    label,
    listeners,
    translate,
    type,
    ...props
  },
  ref
) {
  return (
    // styles.Draggable,
    // dragging && styles.dragging,
    // handle && styles.handle
    <div
      className={`
        Draggable 
        ${dragOverlay ? "dragOverlay" : ""} 
        ${dragging ? "dragging" : ""}
`}
      style={{
        "--translate-x": `${translate?.x ?? 0}px`,
        "--translate-y": `${translate?.y ?? 0}px`,
      }}
    >
      <button
        ref={ref}
        aria-label="Draggable"
        data-cypress="draggable-item"
        {...(handle ? {} : listeners)}
        tabIndex={handle ? -1 : undefined}
        {...props}
      >
        {/* TODO: type name change */}

        {type.component}

        {/* {axis === Axis.Vertical
          ? draggableVertical
          : axis === Axis.Horizontal
          ? draggableHorizontal
          : draggable} */}
        {/* {handle ? <Handle {...(handle ? listeners : {})} /> : null} */}
      </button>
      {/* {label ? <label>{label}</label> : null} */}
    </div>
  );
});

// export const Axis = { All, Vertical, Horizontal };
