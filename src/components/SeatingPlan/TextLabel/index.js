import React, { useState } from 'react';
import {
  DndContext,
  useSensor,
  MouseSensor,
  TouchSensor,
  useSensors
} from '@dnd-kit/core';
import { Wrapper } from '../../Wrapper';
import './style.css';
import { updateTextLabelOnDB } from './utils';
import DraggableItem from '../Seat/DraggableItem';
import { ReactComponent as IconHandle } from '../../../assets/handle.svg';

import { getTranslateStyle } from '../Seat/utils';
import { Resizable } from 're-resizable';

export const TextLabel = ({
  id,
  activationConstraint,
  modifiers,
  gridSize,
  coordinates,
  value,
  initialWidth,
  initialHeight,
  deleteText,
  editable
}) => {
  const defaultCoordinates = {
    x: coordinates ? coordinates.x * gridSize : 0,
    y: coordinates ? coordinates.y * gridSize : 0
  };

  const [{ translate }, setTranslate] = useState({
    initialTranslate: defaultCoordinates,
    translate: defaultCoordinates
  });
  const [initialWindowScroll, setInitialWindowScroll] =
    useState(defaultCoordinates);
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  const [text, setText] = useState(value);

  const handleOnDragStart = () => {
    setInitialWindowScroll({
      x: window.scrollX,
      y: window.scrollY
    });
  };

  const handleOnDragMove = ({ delta }) => {
    setTranslate(({ initialTranslate }) => ({
      initialTranslate,
      translate: {
        x: initialTranslate.x + delta.x - initialWindowScroll.x,
        y: initialTranslate.y + delta.y - initialWindowScroll.y
      }
    }));
  };

  const handleOnDragEnd = (over) => {
    setTranslate(({ translate }) => {
      return {
        translate,
        initialTranslate: translate
      };
    });
    setInitialWindowScroll(translate, defaultCoordinates);
    coordinates.x = parseInt(translate.x / gridSize);
    coordinates.y = parseInt(translate.y / gridSize);
    updateTextLabelOnDB({
      id: id,
      value: text,
      width: width,
      height: height,
      ...coordinates
    });
    if (coordinates.x < 0 || coordinates.y < 0) {
      deleteText(id);
    }
  };

  const handleOnDragCancel = () => {
    setTranslate(({ initialTranslate }) => ({
      translate: initialTranslate,
      initialTranslate
    }));
    setInitialWindowScroll(defaultCoordinates);
  };

  const updateSize = (e, direction, ref, d) => {
    const updatedWidth = width + d.width;
    const updatedHeight = height + d.height;
    console.log(updatedWidth, updatedHeight);
    setWidth(updatedWidth);
    setHeight(updatedHeight);
    updateTextLabelOnDB({
      id: id,
      ...coordinates,
      value: text,
      width: updatedWidth,
      height: updatedHeight
    });
  };

  const updateTextValue = (e) => {
    setText(e.target.value);
    updateTextLabelOnDB({
      id: id,
      ...coordinates,
      value: e.target.value,
      width: width,
      height: height
    });
  };

  const [width, setWidth] = useState(initialWidth);
  const [height, setHeight] = useState(initialHeight);

  const style = {
    width: gridSize * 1 - 1,
    height: gridSize * 1 - 1,
    marginLeft: -gridSize
  };

  return (
    <>
      <DndContext sensors={sensors}>
        <Wrapper>
          <TranslatedItem
            translate={translate}
            innerComponent={{
              component: (
                <>
                  {editable ? (
                    <Resizable
                      size={{
                        width: width,
                        height: height
                      }}
                      // enable={editable}
                      minHeight={gridSize - 2}
                      minWidth={gridSize - 2}
                      grid={[gridSize, gridSize]}
                      onResizeStop={updateSize}
                    >
                      <textarea value={text} onChange={updateTextValue} />
                    </Resizable>
                  ) : (
                    <div
                      className="preview-div"
                      style={{ width: width, height: height }}
                    >
                      {text}
                    </div>
                  )}
                </>
              )
            }}
          />
        </Wrapper>
      </DndContext>
      {editable && (
        <DndContext
          sensors={sensors}
          onDragStart={handleOnDragStart}
          onDragMove={handleOnDragMove}
          onDragEnd={handleOnDragEnd}
          onDragCancel={handleOnDragCancel}
          modifiers={modifiers}
        >
          <Wrapper>
            <DraggableItem
              // label={label}
              style={style}
              translate={translate}
              innerComponent={{
                component: <IconHandle />
              }}
            />
          </Wrapper>
        </DndContext>
      )}
    </>
  );
};

const TranslatedItem = ({ translate, innerComponent }) => {
  const translatedStyle = getTranslateStyle(translate);
  return (
    <div className="Translated" style={translatedStyle}>
      {innerComponent.component}
    </div>
  );
};
