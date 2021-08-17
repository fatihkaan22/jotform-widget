import firebase from 'firebase';
import { nanoid } from 'nanoid';
import { GRID, GRID_ITEM, PEOPLE, TEXT_LABEL } from '../../constants/common';

// TODO: change structure - to avoid same user but different forms: /user/formId/seats
export const fetchUserData = async () => {
  const user = firebase.auth().currentUser;
  const dbRef = firebase.database().ref();
  let seatsFromDB = [];
  let textLabelsFromDB = [];
  let seatTypeFromDB;
  await dbRef
    .child(user.uid)
    .get()
    .then((snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        if (userData.seats) seatsFromDB = Object.values(userData.seats);
        seatTypeFromDB = userData.seatType;
        if (userData.texts) textLabelsFromDB = Object.values(userData.texts);
      } else {
        console.log('No data available');
      }
    })
    .catch((error) => {
      console.error(error);
    });
  return { seatsFromDB, seatTypeFromDB, textLabelsFromDB };
};

export const deleteSeatFromDB = (seatId) => {
  const user = firebase.auth().currentUser;
  if (!user) {
    console.log("ERROR: couldn't sign in");
    return;
  }
  firebase.database().ref(`${user.uid}/seats/${seatId}`).set({});
};

export const deleteTextFromDB = (textId) => {
  const user = firebase.auth().currentUser;
  if (!user) {
    console.log("ERROR: couldn't sign in");
    return;
  }
  firebase.database().ref(`${user.uid}/texts/${textId}`).set({});
};

export const updateSeatTypeOnDB = (seatType) => {
  const user = firebase.auth().currentUser;
  if (!user) {
    console.log("ERROR: couldn't sign in");
    return;
  }
  firebase.database().ref(`${user.uid}/seatType/`).set(seatType);
};

export const getMultiSeats = (
  rows,
  columns,
  horizontalSpacing = 1,
  verticalSpacing = 1
) => {
  if (rows < 1 || columns < 1) {
    console.log('ERROR: rows or columns < 1');
    return;
  }
  const start = { x: 1, y: 1 }; // first element
  const newSeats = [];
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      newSeats.push({
        id: `seat-${nanoid()}`,
        x: i * 2 + i * verticalSpacing + start.x,
        y: j * 2 + j * horizontalSpacing + start.y
      });
    }
  }
  return newSeats;
};

export const isPeopleMin = (value) => {
  return value === PEOPLE.MIN;
};

export const isPeopleMax = (value) => {
  return value === PEOPLE.MAX;
};

export const getCurrentDate = () => {
  const today = new Date();
  const date = `${today.getDate()}-${
    today.getMonth() + 1
  }-${today.getFullYear()}`;
  return date;
};

export const fetchReservedSeats = async (date, time) => {
  const user = firebase.auth().currentUser;
  const dbRef = firebase.database().ref();
  let reservedFromBD = [];
  await dbRef
    .child(`${user.uid}/reservations/${date}/${time}`)
    .get()
    .then((snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        const userDataAsList = Object.values(userData);
        reservedFromBD = userDataAsList.map(({ seats }) => seats).flat();
      } else {
        console.log('No data available');
      }
    })
    .catch((error) => {
      console.error(error);
    });
  return reservedFromBD;
};

export const reserveSeat = ({ date, time, people }, seats) => {
  const user = firebase.auth().currentUser;
  if (!user) {
    console.log("ERROR: couldn't sign in");
    return;
  }
  // TODO: consider checking db if reserved
  const reservationsRef = firebase
    .database()
    .ref(`${user.uid}/reservations/${date}/${time}`);
  const newReservation = reservationsRef.push();

  newReservation.set({
    user: user.uid,
    people: people,
    seats: [...seats], // seats is Set
    status: 'reserved'
  });
};

export const isPeopleLessThanSelected = (noPeople, noSelected) =>
  noPeople === noSelected || noPeople < noSelected;

export const checkEveryItemIncludes = (array, target) => {
  return target.every((item) => array.includes(item));
};

export const getMousePosition = (event) => {
  const x = parseInt((event.clientX - GRID_ITEM.MARGIN_LEFT) / GRID.SIZE);
  const y = parseInt((event.clientY - GRID_ITEM.MARGIN_TOP) / GRID.SIZE);
  return [x, y];
};

export const getNewTextLabel = (x, y) => {
  return {
    id: `textLabel-${nanoid()}`,
    x: x,
    y: y,
    value: '',
    width: GRID.SIZE * TEXT_LABEL.INITIAL_WIDTH,
    height: GRID.SIZE * TEXT_LABEL.INITIAL_HEIGHT
  };
};

export const isFieldsValid = (fieldState) => {
  return (
    fieldState.date !== '' &&
    fieldState.time !== '' &&
    fieldState.people >= PEOPLE.MIN &&
    fieldState.people <= PEOPLE.MAX
  );
};

export const isSelectedSeatsValid = (selectedSeats) => {
  return selectedSeats.size > 0;
};
