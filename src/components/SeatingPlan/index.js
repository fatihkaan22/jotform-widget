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
  fetchReservedSeats,
  reserveSeat,
  isPeopleLessThanSelected,
} from "./utils";
import { createSnapModifier, restrictToWindowEdges } from "@dnd-kit/modifiers";
import { nanoid } from "nanoid";
import { Dropdown } from "../Dropdown";
import {
  Input,
  Grid as GridUI,
  Button,
  Form,
  Popup,
  TransitionablePortal,
  Message,
} from "semantic-ui-react";
import { DateInput, TimeInput } from "semantic-ui-calendar-react";
import { MultiAddPopup } from "./Seat/MultiAddPopup";
import { GRID, PEOPLE } from "../../constants/input";
import SEAT_TYPES_MAP from "../../constants/icons";

export const SeatingPlan = (props) => {
  const [gridSize, setGridSize] = useState(GRID.SIZE);
  const itemStyle = {
    // marginTop: gridSize + 1,
    // marginLeft: gridSize + 1,
    width: gridSize * GRID.ITEM_WIDTH - 1,
    height: gridSize * GRID.ITEM_HEIGHT - 1,
  };

  // TODO: consider putting states in a single object
  const [seats, setSeats] = useState([]);
  const defaultType = Object.keys(SEAT_TYPES_MAP)[0];
  const [selectedType, setSelectedType] = useState(defaultType);
  const [selectedSeats, setSelectedSeats] = useState(new Set());
  const [reservedSeats, setReservedSeats] = useState([]);
  const snapToGrid = useMemo(() => createSnapModifier(gridSize), [gridSize]);
  const [fieldState, setFieldState] = useState({
    date: "",
    time: "",
    people: PEOPLE.DEFAULT,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorAllReserved, setErrorAllReserved] = useState(false);
  const [errorSelectSeat, setErrorSelectSeat] = useState(false);

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
    const updatedSeats = seats.filter((seat) => seatId !== seat.id);
    setSeats(updatedSeats);
    deleteSeatFromDB(seatId);
  };

  const handleDropdownChange = (selectedType) => {
    setSelectedType(selectedType);
    updateSeatTypeOnDB(selectedType);
  };

  const selectSeat = (seatId) => {
    if (isPeopleLessThanSelected(fieldState.people, selectedSeats.size)) {
      setErrorSelectSeat(true);
      return;
    }
    setErrorSelectSeat(false);
    setSelectedSeats(new Set([...selectedSeats, seatId]));
  };

  const unselectSeat = (seatId) => {
    // TODO:
    // const updatedSeats = [...selectedSeats].filter((id) => seatId !== id);
    // setSelectedSeats(new Set([...updatedSeats]));
    setSelectedSeats((prevSelectedSeats) => {
      const updatedSeats = [...prevSelectedSeats].filter((id) => seatId !== id);
      return new Set(updatedSeats);
    });
    setErrorSelectSeat(false);
  };

  const seatList = seats.map((seat) => (
    <Seat
      id={seat.id}
      key={seat.id}
      coordinates={{ x: seat.x, y: seat.y }}
      style={itemStyle}
      modifiers={[snapToGrid, restrictToWindowEdges]}
      gridSize={gridSize}
      deleteSeat={deleteSeat}
      selectSeat={selectSeat}
      unselectSeat={unselectSeat}
      draggable={props.editable}
      seatType={SEAT_TYPES_MAP[selectedType]}
      selected={selectedSeats.has(seat.id)}
      reserved={reservedSeats.includes(seat.id)}
    />
  ));

  // date - time fields
  const handleChange = (event, { name, value }) => {
    // TODO: clear selectables
    if (fieldState.hasOwnProperty(name)) {
      setFieldState({ ...fieldState, [name]: value });
    }
  };

  const handlePeopleDecrement = (event) => {
    if (isPeopleLessThanSelected(fieldState.people, selectedSeats.size)) {
      setErrorSelectSeat(true);
      return;
    }
    if (!isPeopleMin(fieldState.people)) {
      setFieldState({ ...fieldState, people: fieldState.people - 1 });
      setErrorSelectSeat(false);
    }
  };

  const handlePeopleIncrement = (event) => {
    if (!isPeopleMax(fieldState.people)) {
      setFieldState({ ...fieldState, people: fieldState.people + 1 });
      setErrorSelectSeat(false);
    }
  };

  const handleCheckAvailability = (event) => {
    if (!fieldState.date || !fieldState.time || !fieldState.people) {
      console.log("ERROR: empty fields");
      return;
    }
    // TODO: all seats are available / no seats are available
    const getReserved = async () => {
      setIsLoading(true);
      const reservedFromBD = await fetchReservedSeats(
        fieldState.date,
        fieldState.time
      );
      setReservedSeats(reservedFromBD);
      // TODO: doesn't unselect elements, why?
      reservedFromBD.forEach((seatId) => unselectSeat(seatId));
      setIsLoading(false);
      if (reservedFromBD.length === seats.length) {
        // all seats reserved
        console.log("all busy");
        setErrorAllReserved(true);
      }
    };
    getReserved();
  };

  // for debugging purposes; to simulate submit
  const handleUp = (event) => {
    if (
      !fieldState.date ||
      !fieldState.time ||
      !fieldState.people ||
      !selectedSeats ||
      selectedSeats.size === 0
    ) {
      console.log("ERROR: empty fields");
      return;
    }
    reserveSeat(fieldState, selectedSeats);
    setSelectedSeats(new Set());
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
                    value={fieldState.date}
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
                    value={fieldState.time}
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
                    value={fieldState.people}
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
              <Button
                color="red"
                loading={isLoading}
                content="Check Availability"
                onClick={handleCheckAvailability}
              />
              <TransitionablePortal
                open={errorAllReserved}
                onClose={() => setErrorAllReserved(false)}
              >
                <Message error className="info-portal">
                  <Message.Header>All seats are reserved</Message.Header>
                  <p>{`There are no available seats on ${fieldState.date} at ${fieldState.time}.`}</p>
                </Message>
              </TransitionablePortal>
              <TransitionablePortal
                open={errorSelectSeat}
                onClose={() => setErrorSelectSeat(false)}
              >
                <Message warning className="info-portal">
                  <Message.Header>Couldn't make selection</Message.Header>
                  <p>{`You can not select seats more than number of people (${fieldState.people}).`}</p>
                </Message>
              </TransitionablePortal>
              <Button icon="angle up" onClick={handleUp} />
            </GridUI.Column>
          </GridUI>
        </div>
      )}
      {seatList}
      <Grid size={gridSize} onSizeChange={setGridSize} />
    </>
  );
};
