import firebase from "firebase";

// TODO: change structure - to avoid same user but different forms: /user/formId/seats
export const fetchInitialPositions = async () => {
  const user = firebase.auth().currentUser;
  const dbRef = firebase.database().ref();
  let updatedSeats = [];
  await dbRef
    .child(user.uid)
    .child("seats")
    .get()
    .then((snapshot) => {
      if (snapshot.exists()) {
        updatedSeats = Object.values(snapshot.val());
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
  return updatedSeats;
};

export const deleteSeatFromDB = (seatId) => {
  const user = firebase.auth().currentUser;
  if (!user) {
    console.log("ERROR: couldn't sign in");
    return;
  }
  firebase
    .database()
    .ref(user.uid + "/seats/" + seatId)
    .set({});
};
