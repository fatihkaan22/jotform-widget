import { useState, useMemo, useEffect, useCallback } from "react";
import { Seat } from "./Seat";
import { Grid } from "../Grid";
import "./style.css";
import { fetchInitialPositions, deleteSeatFromDB } from "./utils";
import trash from "react-useanimations/lib/trash";
import { createSnapModifier, restrictToWindowEdges } from "@dnd-kit/modifiers";
import { nanoid } from "nanoid";
import UseAnimations from "react-useanimations";
import { ObjectSelector } from "../ObjectSelector";
import { Input, Grid as GridUI, Button, Form } from "semantic-ui-react";
import { DateInput, TimeInput } from "semantic-ui-calendar-react";
import { ReactComponent as IconTableCircle } from "../../assets/table_circle.svg";
import { ReactComponent as IconTableSquare } from "../../assets/table_square.svg";
import { ReactComponent as IconArmchair } from "../../assets/armchair.svg";

export const SeatingPlan = (props) => {
  const [gridSize, setGridSize] = useState(20);
  const itemStyle = {
    // marginTop: gridSize + 1,
    // marginLeft: gridSize + 1,
    width: gridSize * 2 - 1,
    height: gridSize * 2 - 1,
  };

  const seatTypesMap = {
    squareTable: {
      component: <IconTableSquare />,
      text: "Square Table",
    },
    circleTable: {
      component: <IconTableCircle />,
      text: "Circular Table",
    },
    armchair: {
      component: <IconArmchair />,
      text: "Armchair",
    },
  };

  const [seats, setSeats] = useState([]);
  const defaultType = Object.keys(seatTypesMap)[0];
  const [selectedType, setSelectedType] = useState(defaultType);
  const snapToGrid = useMemo(() => createSnapModifier(gridSize), [gridSize]);

  useEffect(() => {
    const getSeats = async () => {
      const seatsFromDB = await fetchInitialPositions();
      setSeats(seatsFromDB);
    };
    getSeats();
  }, []);

  const deleteSeat = (seatId) => {
    const updatedSeats = seats.filter((s) => seatId !== s.id);
    setSeats(updatedSeats);
    deleteSeatFromDB(seatId);
  };

  const seatList = seats.map((seat) => (
    <Seat
      id={seat.id}
      coordinates={{ x: seat.x, y: seat.y }}
      style={itemStyle}
      modifiers={[snapToGrid, restrictToWindowEdges]}
      gridSize={gridSize}
      key={seat.id}
      deleteSeat={deleteSeat}
      draggable={props.editable}
      seatType={seatTypesMap[selectedType]}
    />
  ));

  const handleAddButtonClick = () => {
    setSeats([...seats, { id: "seat-" + nanoid(), x: 0, y: 0 }]);
  };

  return (
    <>
      {props.editable ? (
        <div className="menu-edit">
          <GridUI columns={2}>
            <GridUI.Column>
              <Form>
                <Form.Field>
                  <label>Select type and add</label>
                  <ObjectSelector
                    options={seatTypesMap}
                    value={selectedType}
                    onChange={setSelectedType}
                  />
                </Form.Field>
              </Form>
            </GridUI.Column>
            <GridUI.Column floated="left" verticalAlign="bottom">
              <Form>
                <Form.Field>
                  {/* <label>Add</label> */}
                  <Button icon="add" onClick={handleAddButtonClick} />
                </Form.Field>
              </Form>
            </GridUI.Column>
          </GridUI>
          {/* <div className="delete">
            <UseAnimations animation={trash} size={40} strokeColor="red" />
          </div> */}
        </div>
      ) : (
        <div className="menu-preview">
          <GridUI columns={4}>
            <GridUI.Column width={4}>
              <Form>
                <Form.Field>
                  <label>Date</label>
                  <DateInput />
                </Form.Field>
              </Form>
            </GridUI.Column>
            <GridUI.Column width={4}>
              <Form>
                <Form.Field>
                  <label>Time</label>
                  <TimeInput />
                </Form.Field>
              </Form>
            </GridUI.Column>
            <GridUI.Column width={2}>
              <Form>
                <Form.Field>
                  <label>People</label>
                  <Input type="text" action>
                    <input />
                    <Button icon="minus" />
                    <Button icon="plus" />
                  </Input>
                </Form.Field>
              </Form>
            </GridUI.Column>
            <GridUI.Column floated="right" width={4} verticalAlign="bottom">
              <Button color="red" content="Check Availability" />
            </GridUI.Column>
          </GridUI>
        </div>
      )}
      {seatList}
      <Grid size={gridSize} onSizeChange={setGridSize} />
    </>
  );
};
