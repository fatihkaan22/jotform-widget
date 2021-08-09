import React, { useState } from "react";

import {
  DndContext,
  useDraggable,
  useSensor,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensors,
} from "@dnd-kit/core";

import { Draggable } from "../../Draggable";
import { Wrapper } from "../../Wrapper";

import "./style.css";
import UseAnimations from "react-useanimations";
import radioButton from "react-useanimations/lib/radioButton";

import { getTranslateStyle, updateSeatPositionsOnDB } from "./utils";

export const Seat = ({
  id,
  activationConstraint,
  modifiers,
  style,
  gridSize,
  coordinates,
  deleteSeat,
  draggable,
  seatType,
}) => {
  const defaultCoordinates = {
    x: coordinates ? coordinates.x * gridSize : 0,
    y: coordinates ? coordinates.y * gridSize : 0,
  };
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

  const handleOnDragStart = () => {
    setInitialWindowScroll({
      x: window.scrollX,
      y: window.scrollY,
    });
  };

  const handleOnDragMove = ({ delta }) => {
    setTranslate(({ initialTranslate }) => ({
      initialTranslate,
      translate: {
        x: initialTranslate.x + delta.x - initialWindowScroll.x,
        y: initialTranslate.y + delta.y - initialWindowScroll.y,
      },
    }));
  };

  const handleOnDragEnd = (over) => {
    setTranslate(({ translate }) => {
      return {
        translate,
        initialTranslate: translate,
      };
    });
    setInitialWindowScroll(translate, defaultCoordinates);
    coordinates.x = parseInt(translate.x / gridSize);
    coordinates.y = parseInt(translate.y / gridSize);
    updateSeatPositionsOnDB({ id: id, ...coordinates });
    if (coordinates.x < 0 || coordinates.y < 0) {
      deleteSeat(id);
    }
  };

  const handleOnDragCancel = () => {
    setTranslate(({ initialTranslate }) => ({
      translate: initialTranslate,
      initialTranslate,
    }));
    setInitialWindowScroll(defaultCoordinates);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleOnDragStart}
      onDragMove={handleOnDragMove}
      onDragEnd={handleOnDragEnd}
      onDragCancel={handleOnDragCancel}
      modifiers={modifiers}
    >
      <Wrapper>
        {draggable ? (
          <DraggableItem
            // label={label}
            style={style}
            translate={translate}
            innerComponent={seatType}
          />
        ) : (
          <SelectableItem
            style={style}
            innerComponent={seatType}
            translate={translate}
          />
        )}
      </Wrapper>
    </DndContext>
  );
};

const DraggableItem = ({ label, style, translate, innerComponent }) => {
  const { attributes, isDragging, listeners, setNodeRef } = useDraggable({
    id: "draggable",
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

const SelectableItem = ({ style, translate, innerComponent }) => {
  const [checked, setChecked] = useState(false);
  const styleSelectable = getTranslateStyle(translate);
  if (checked) style = { ...style, backgroundColor: "#F45B69" };

  return (
    <div className="Selectable" style={styleSelectable}>
      <button style={style} onClick={() => setChecked(!checked)}>
        {innerComponent.component}
      </button>
    </div>
  );
};
