import React from "react";
import "./Wrapper.css";

export function Wrapper({ children, center, style }) {
  return (
    <div className={`Wrapper ${center ? "center" : ""}`} style={style}>
      {children}
    </div>
  );
}
