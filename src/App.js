import { useState, useMemo } from "react";

import { Droppable } from "./components/Droppable";
import { Seat } from "./components/Seat";
import { Grid } from "./components/Grid";

import {
  createSnapModifier,
  //   restrictToHorizontalAxis,
  //   restrictToVerticalAxis,
  //   restrictToWindowEdges,
  //   snapCenterToCursor,
} from "@dnd-kit/modifiers";

function App() {
  const [gridSize, setGridSize] = useState(30);
  const itemStyle = {
    marginTop: 11,
    marginLeft: 11,
    width: gridSize * 2 - 1,
    height: gridSize * 2 - 1,
  };
  const snapToGrid = useMemo(() => createSnapModifier(gridSize), [gridSize]);

  return (
    <>
      <Seat style={itemStyle} modifiers={[snapToGrid]} key={gridSize} />
      <Seat style={itemStyle} modifiers={[snapToGrid]} key={gridSize} />
      <Seat style={itemStyle} modifiers={[snapToGrid]} key={gridSize} />
      <Grid size={gridSize} onSizeChange={setGridSize} />
    </>
  );
}

export default App;
