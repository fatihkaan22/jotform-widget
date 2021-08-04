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
    marginTop: gridSize + 1,
    marginLeft: gridSize + 1,
    width: gridSize * 2 - 1,
    height: gridSize * 2 - 1,
  };
  const snapToGrid = useMemo(() => createSnapModifier(gridSize), [gridSize]);

  return (
    <>
      <Seat
        coordinates={{ x: 0, y: 0 }}
        style={itemStyle}
        modifiers={[snapToGrid]}
        gridSize={gridSize}
      />
      <Seat
        coordinates={{ x: 0, y: 3 }}
        style={itemStyle}
        modifiers={[snapToGrid]}
        gridSize={gridSize}
      />
      <Seat
        coordinates={{ x: 3, y: 0 }}
        style={itemStyle}
        modifiers={[snapToGrid]}
        gridSize={gridSize}
      />
      <Grid size={gridSize} onSizeChange={setGridSize} />
    </>
  );
}

export default App;
