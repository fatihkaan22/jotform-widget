import React, { useState } from "react";

import {
  DndContext,
  useDraggable,
  useSensor,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  Translate,
  PointerActivationConstraint,
  Modifiers,
  useSensors,
} from "@dnd-kit/core";

import {
  createSnapModifier,
  //   restrictToHorizontalAxis,
  //   restrictToVerticalAxis,
  //   restrictToWindowEdges,
  //   snapCenterToCursor,
} from "@dnd-kit/modifiers";

import { Draggable } from "./Draggable";
import { Wrapper } from "./Wrapper";

export function Seat({
  id,
  activationConstraint,
  modifiers,
  style,
  gridSize,
  coordinates,
}) {
  let defaultCoordinates = {
    x: 0,
    y: 0,
  };
  if (coordinates) {
    defaultCoordinates = {
      x: coordinates.x * gridSize,
      y: coordinates.y * gridSize,
    };
  }
  const [{ translate }, setTranslate] = useState({
    initialTranslate: defaultCoordinates,
    translate: defaultCoordinates,
  });
  const [initialWindowScroll, setInitialWindowScroll] =
    useState(defaultCoordinates);
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint,
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint,
  });
  const keyboardSensor = useSensor(KeyboardSensor, {});
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={() => {
        setInitialWindowScroll({
          x: window.scrollX,
          y: window.scrollY,
        });
      }}
      onDragMove={({ delta }) => {
        setTranslate(({ initialTranslate }) => ({
          initialTranslate,
          translate: {
            x: initialTranslate.x + delta.x - initialWindowScroll.x,
            y: initialTranslate.y + delta.y - initialWindowScroll.y,
          },
        }));
      }}
      onDragEnd={() => {
        setTranslate(({ translate }) => {
          return {
            translate,
            initialTranslate: translate,
          };
        });
        setInitialWindowScroll(defaultCoordinates);
        coordinates.x = translate.x / gridSize;
        coordinates.y = translate.y / gridSize;
        console.log(id, coordinates);
      }}
      onDragCancel={() => {
        setTranslate(({ initialTranslate }) => ({
          translate: initialTranslate,
          initialTranslate,
        }));
        setInitialWindowScroll(defaultCoordinates);
      }}
      modifiers={modifiers}
    >
      <Wrapper>
        <DraggableItem
          // axis={axis}
          // label={label}
          // handle={handle}
          style={style}
          translate={translate}
        >
          DRAG
        </DraggableItem>
      </Wrapper>
    </DndContext>
  );
}

function DraggableItem({ axis, label, style, translate, handle }) {
  const { attributes, isDragging, listeners, setNodeRef } = useDraggable({
    id: "draggable",
  });

  return (
    <Draggable
      ref={setNodeRef}
      dragging={isDragging}
      handle={handle}
      label={label}
      listeners={listeners}
      style={style}
      translate={translate}
      axis={axis}
      {...attributes}
    />
  );
}
