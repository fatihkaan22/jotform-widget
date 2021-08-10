import firebase from "firebase";

export const getTranslateStyle = (translate) => {
  // const shift = { x: 11, y: 81 };
  const shift = { x: 1, y: 71 };
  return {
    "--translate-x": `${translate?.x + shift.x ?? 0}px`,
    "--translate-y": `${translate?.y + shift.y ?? 0}px`,
  };
};

export const updateSeatPositionsOnDB = (seat) => {
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
};