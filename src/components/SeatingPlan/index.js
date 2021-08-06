import { useState, useMemo, useEffect } from "react";

import { Seat } from "../Seat/Seat";
import { Grid } from "../Grid";
import { Droppable } from "../Droppable";
import "./SeatingPlan.css";
import trash from "react-useanimations/lib/trash";

import {
  createSnapModifier,
  //   restrictToHorizontalAxis,
  //   restrictToVerticalAxis,
  //   restrictToWindowEdges,
  //   snapCenterToCursor,
} from "@dnd-kit/modifiers";

import { nanoid } from "nanoid";
import firebase from "firebase";
import { useList } from "react-firebase-hooks/database";
import UseAnimations from "react-useanimations";
import { ObjectSelector } from "../ObjectSelector";
import { Input, Grid as GridUI, Button, Icon } from "semantic-ui-react";
// import SemanticDatepicker from "react-semantic-ui-datepickers";
// import "react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css";

import {
  DateInput,
  TimeInput,
  DateTimeInput,
  DatesRangeInput,
} from "semantic-ui-calendar-react";

import { ReactComponent as IconTableCircle } from "../../assets/table_circle.svg";
import { ReactComponent as IconTableSquare } from "../../assets/table_square.svg";
import { ReactComponent as IconArmchair } from "../../assets/armchair.svg";

export const SeatingPlan = (props) => {
  const [gridSize, setGridSize] = useState(20);
  const itemStyle = {
    marginTop: gridSize + 1,
    marginLeft: gridSize + 1,
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

  const user = firebase.auth().currentUser;
  const [seats, setSeats] = useState([]);
  const defaultType = Object.keys(seatTypesMap)[0];
  const [selectedType, setSelectedType] = useState(defaultType);
  const snapToGrid = useMemo(() => createSnapModifier(gridSize), [gridSize]);

  useEffect(() => {
    fetchInitialPositions();
  }, []);

  const seatList = seats.map((seat) => (
    <Seat
      id={seat.id}
      coordinates={{ x: seat.x, y: seat.y }}
      style={itemStyle}
      modifiers={[snapToGrid]}
      gridSize={gridSize}
      key={seat.id}
      deleteSeat={deleteSeat}
      draggable={props.editable}
      type={seatTypesMap[selectedType]}
    />
  ));

  // const seatTypesKeys = Object.keys(seatTypesMap);
  // console.log(seatTypesKeys);

  // const [seatType, setSeatType] = useState(seatTypes[0].text);

  function deleteSeat(seatId) {
    const updatedSeats = seats.filter((s) => seatId !== s.id);
    setSeats(updatedSeats);
    const user = firebase.auth().currentUser;
    if (!user) {
      console.log("ERROR: couldn't sign in");
      return;
    }
    firebase
      .database()
      .ref(user.uid + "/seats/" + seatId)
      .set({});
  }

  function handleAddButtonClick() {
    setSeats([...seats, { id: "seat-" + nanoid(), x: 2, y: 0 }]);
  }

  // TODO: change structure - to avoid same user but different forms: /user/formId/seats
  function fetchInitialPositions() {
    const dbRef = firebase.database().ref();
    dbRef
      .child(user.uid)
      .child("seats")
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          const updatedSeats = Object.values(snapshot.val());
          setSeats(updatedSeats);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <>
      {props.editable ? (
        <div className="menu">
          <GridUI>
            <GridUI.Column width={2}>
              <ObjectSelector
                options={seatTypesMap}
                value={selectedType}
                onChange={setSelectedType}
              />
            </GridUI.Column>
            <GridUI.Column width={1}>
              <Button icon="add" onClick={handleAddButtonClick} />
            </GridUI.Column>
          </GridUI>
          {/* <div className="delete">
            <UseAnimations animation={trash} size={40} strokeColor="red" />
          </div> */}
        </div>
      ) : (
        <div className="menu">
          <GridUI>
            <GridUI.Column>
              <DateInput />
            </GridUI.Column>
            <GridUI.Column>
              <TimeInput />
            </GridUI.Column>
          </GridUI>
        </div>
      )}
      {seatList}
      <Grid size={gridSize} onSizeChange={setGridSize} />
    </>
  );
};
