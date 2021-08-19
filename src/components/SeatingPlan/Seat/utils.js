import firebase from 'firebase';
import { GRID_ITEM } from '../../../constants/common';

export const getTranslateStyle = (translate) => {
  const shift = { x: GRID_ITEM.MARGIN_LEFT, y: GRID_ITEM.MARGIN_TOP };
  return {
    '--translate-x': `${translate?.x + shift.x ?? 0}px`,
    '--translate-y': `${translate?.y + shift.y ?? 0}px`
  };
};

export const updateSeatPositionsOnDB = (seat) => {
  console.log(seat);
  const userId = window.JFId || firebase.auth().currentUser.uid;
  if (!userId) {
    console.log("ERROR: couldn't sign in");
    return;
  }
  firebase.database().ref(`${userId}/seats/${seat.id}`).set({
    id: seat.id,
    x: seat.x,
    y: seat.y
  });
};
