import React from "react";
import "./Grid.css"

export function Grid({ size }) {
  return (
    <div
      className="Grid"
      style={{
        "--grid-size": `${size}px`,
      }}
    />
  );
}
