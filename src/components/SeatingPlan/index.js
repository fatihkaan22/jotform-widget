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

export function SeatingPlan(props) {
  const user = firebase.auth().currentUser;
  const [seats, setSeats] = useState([]);
  //   const [snapshots, loading, error] = useList(
  //     firebase.database().ref(`${user.uid}/seats`)
  //   );

  const [gridSize, setGridSize] = useState(20);
  const itemStyle = {
    marginTop: gridSize + 1,
    marginLeft: gridSize + 1,
    width: gridSize * 2 - 1,
    height: gridSize * 2 - 1,
  };
  const snapToGrid = useMemo(() => createSnapModifier(gridSize), [gridSize]);

  useEffect(() => {
    fetchInitialPositions();
  }, []);

  const seatList = seats.map((s) => (
    <Seat
      id={s.id}
      coordinates={{ x: s.x, y: s.y }}
      style={itemStyle}
      modifiers={[snapToGrid]}
      gridSize={gridSize}
      key={s.id}
      deleteSeat={deleteSeat}
      draggable={props.editable}
    />
  ));

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
      {props.editable && (
        <div>
          <button className="add-button" onClick={handleAddButtonClick}>
            Add
          </button>
          <div className="delete">
            <UseAnimations animation={trash} size={40} strokeColor="red" />
          </div>
        </div>
      )}

      {seatList}
      <Grid size={gridSize} onSizeChange={setGridSize} />
    </>
  );
}
