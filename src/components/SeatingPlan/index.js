import { useState, useMemo, useEffect } from "react";
import { Seat } from "./Seat";
import { Grid } from "../Grid";
import "./style.css";
import {
  deleteSeatFromDB,
  updateSeatTypeOnDB,
  fetchUserData,
  getMultiSeats,
  isPeopleMin,
  isPeopleMax,
  getCurrentDate,
} from "./utils";
import { createSnapModifier, restrictToWindowEdges } from "@dnd-kit/modifiers";
import { nanoid } from "nanoid";
import { Dropdown } from "../Dropdown";
import { Input, Grid as GridUI, Button, Form, Popup } from "semantic-ui-react";
import {
  DateInput,
  TimeInput,
  DatesRangeInput,
} from "semantic-ui-calendar-react";
import { MultiAddPopup } from "./Seat/MultiAddPopup";
import { GRID, MULTI_ADD, PEOPLE } from "../../constants/input";
import SEAT_TYPES_MAP from "../../constants/icons";

export const SeatingPlan = (props) => {
  const [gridSize, setGridSize] = useState(GRID.SIZE);
  const itemStyle = {
    // marginTop: gridSize + 1,
    // marginLeft: gridSize + 1,
    width: gridSize * GRID.ITEM_WIDTH - 1,
    height: gridSize * GRID.ITEM_HEIGHT - 1,
  };

  const [seats, setSeats] = useState([]);
  const defaultType = Object.keys(SEAT_TYPES_MAP)[0];
  const [selectedType, setSelectedType] = useState(defaultType);
  const snapToGrid = useMemo(() => createSnapModifier(gridSize), [gridSize]);

  useEffect(() => {
    const getSeats = async () => {
      const { seatsFromDB, seatTypeFromDB } = await fetchUserData();
      setSeats(seatsFromDB ? seatsFromDB : []);
      setSelectedType(seatTypeFromDB ? seatTypeFromDB : defaultType);
    };
    getSeats();
  }, []);

  const handleAddButtonClick = () => {
    setSeats([...seats, { id: "seat-" + nanoid(), x: 0, y: 0 }]);
  };

  const handleMultiAddButtonClick = (
    rows,
    columns,
    horizontalSpacing,
    verticalSpacing
  ) => {
    const newSeats = getMultiSeats(
      rows,
      columns,
      horizontalSpacing,
      verticalSpacing
    );

    setSeats([...seats, ...newSeats]);
  };

  const deleteSeat = (seatId) => {
    const updatedSeats = seats.filter((s) => seatId !== s.id);
    setSeats(updatedSeats);
    deleteSeatFromDB(seatId);
  };

  const handleDropdownChange = (selectedType) => {
    setSelectedType(selectedType);
    updateSeatTypeOnDB(selectedType);
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
      seatType={SEAT_TYPES_MAP[selectedType]}
    />
  ));

  const [state, setState] = useState({
    date: "",
    time: "",
    people: PEOPLE.DEFAULT,
  });

  const handleChange = (event, { name, value }) => {
    if (state.hasOwnProperty(name)) {
      // TODO: why not?
      // setState({ [name]: value });
      setState({ ...state, [name]: value });
    }
  };

  const handlePeopleDecrement = (event) => {
    if (!isPeopleMin(state.people)) {
      setState({ ...state, people: state.people - 1 });
    }
  };

  const handlePeopleIncrement = (event) => {
    if (!isPeopleMax(state.people)) {
      setState({ ...state, people: state.people + 1 });
    }
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
                  <Dropdown
                    options={SEAT_TYPES_MAP}
                    value={selectedType}
                    onChange={handleDropdownChange}
                  />
                </Form.Field>
              </Form>
            </GridUI.Column>
            <GridUI.Column verticalAlign="bottom">
              <Popup
                content={"Add object"}
                position="bottom center"
                trigger={<Button icon="add" onClick={handleAddButtonClick} />}
              />
              <MultiAddPopup onSubmit={handleMultiAddButtonClick} />
              <Popup
                content="To remove objects move outside of the grid."
                position="bottom center"
                trigger={<Button icon="trash" />}
              />
            </GridUI.Column>
          </GridUI>
        </div>
      ) : (
        <div className="menu-preview">
          <GridUI columns={4}>
            <GridUI.Column width={4}>
              <Form>
                <Form.Field>
                  <label>Date</label>
                  <DateInput
                    name="date"
                    value={state.date}
                    onChange={handleChange}
                    minDate={getCurrentDate()}
                    // maxDate={TODO}

                  />
                </Form.Field>
              </Form>
            </GridUI.Column>
            <GridUI.Column width={4}>
              <Form>
                <Form.Field>
                  <label>Time</label>
                  <TimeInput
                    name="time"
                    value={state.time}
                    onChange={handleChange}
                    disableMinute
                  />
                </Form.Field>
              </Form>
            </GridUI.Column>
            <GridUI.Column width={2}>
              <Form>
                <Form.Field>
                  <label>People</label>
                  <Input
                    value={state.people}
                    type="number"
                    className="no-spinner"
                    min={PEOPLE.MIN}
                    max={PEOPLE.MAX}
                    action
                  >
                    <input />
                    <Button icon="minus" onClick={handlePeopleDecrement} />
                    <Button icon="plus" onClick={handlePeopleIncrement} />
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
