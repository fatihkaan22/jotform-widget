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

import { nanoid } from "nanoid";

function App() {
  const seats = [
    { id: "seat-" + nanoid(), x: 0, y: 0 },
    { id: "seat-" + nanoid(), x: 0, y: 3 },
    { id: "seat-" + nanoid(), x: 3, y: 0 },
    { id: "seat-" + nanoid(), x: 3, y: 3 },
  ];
  const [gridSize, setGridSize] = useState(40);
  const itemStyle = {
    marginTop: gridSize + 1,
    marginLeft: gridSize + 1,
    width: gridSize * 2 - 1,
    height: gridSize * 2 - 1,
  };
  const snapToGrid = useMemo(() => createSnapModifier(gridSize), [gridSize]);

  const seatList = seats.map((s) => (
    <Seat
      id={s.id}
      coordinates={{ x: s.x, y: s.y }}
      style={itemStyle}
      modifiers={[snapToGrid]}
      gridSize={gridSize}
      key={s.id}
    />
  ));

  return (
    <>
      {seatList}
      <Grid size={gridSize} onSizeChange={setGridSize} />
    </>
  );
}

export default App;
