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
import { Wrapper } from "../../Wrapper";
import "./style.css";
import { updateSeatPositionsOnDB } from "./utils";
import SelectableItem from "./SelectableItem";
import DraggableItem from "./DraggableItem";

export const Seat = ({
  id,
  activationConstraint,
  modifiers,
  style,
  gridSize,
  coordinates,
  deleteSeat,
  selectSeat,
  unselectSeat,
  draggable,
  seatType,
  selected,
  reserved,
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
            id={id}
            style={style}
            innerComponent={seatType}
            translate={translate}
            selectSeat={selectSeat}
            unselectSeat={unselectSeat}
            disabled={reserved}
            selected={selected}
          />
        )}
      </Wrapper>
    </DndContext>
  );
};
