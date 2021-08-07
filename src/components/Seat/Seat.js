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

import { Draggable } from "../Draggable";
import { Wrapper } from "../Wrapper";

import firebase from "firebase";
import { Droppable } from "../Droppable";
import "./Seat.css";
import UseAnimations from "react-useanimations";
import radioButton from "react-useanimations/lib/radioButton";

import { getTranslateStyle } from "./utils";

export function Seat({
  id,
  activationConstraint,
  modifiers,
  style,
  gridSize,
  coordinates,
  deleteSeat,
  draggable,
  type,
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
  const [parent, setParent] = useState(null);

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
      onDragEnd={(over) => {
        console.log(over);
        setParent(over ? over.id : null);

        setTranslate(({ translate }) => {
          return {
            translate,
            initialTranslate: translate,
          };
        });
        setInitialWindowScroll(defaultCoordinates);
        coordinates.x = parseInt(translate.x / gridSize);
        coordinates.y = parseInt(translate.y / gridSize);
        updateOnDB({ id: id, ...coordinates });
        if (coordinates.x < 0 || coordinates.y < 0) {
          deleteSeat(id);
        }
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
        {draggable ? (
          <DraggableItem
            // axis={axis}
            // label={label}
            // handle={handle}
            style={style}
            translate={translate}
            type={type}
          />
        ) : (
          <SelectableItem style={style} type={type} translate={translate} />
        )}
      </Wrapper>
      {/* <Droppable>HERE</Droppable> */}
    </DndContext>
  );
}

function DraggableItem({ axis, label, style, translate, handle, type }) {
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
      type={type}
      {...attributes}
    />
  );
}

function SelectableItem({ style, translate, type }) {
  const [checked, setChecked] = useState(false);

  const styleSelectable = getTranslateStyle(translate);

  if (checked) style = { ...style, backgroundColor: "#F45B69" };
  return (
    <div className="Selectable" style={styleSelectable}>
      <button style={style} onClick={() => setChecked(!checked)}>
        {type.component}
        {/* <UseAnimations
          animation={radioButton}
          onClick={() => setChecked(!checked)}
          reverse={checked}
          strokeColor="white"
          size={40}
          speed={2}
        /> */}
      </button>
    </div>
  );
}

function updateOnDB(seat) {
  console.log(seat);
  const user = firebase.auth().currentUser;
  if (!user) {
    console.log("ERROR: couldn't sign in");
    return;
  }
  firebase
    .database()
    .ref(user.uid + "/seats/" + seat.id)
    .set({
      id: seat.id,
      x: seat.x,
      y: seat.y,
    });
}
