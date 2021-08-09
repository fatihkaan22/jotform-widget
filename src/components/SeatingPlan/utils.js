import firebase from "firebase";

// TODO: change structure - to avoid same user but different forms: /user/formId/seats
export const fetchUserData = async () => {
  const user = firebase.auth().currentUser;
  const dbRef = firebase.database().ref();
  let seatsFromDB = [];
  let seatTypeFromDB;
  await dbRef
    .child(user.uid)
    .get()
    .then((snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        seatsFromDB = Object.values(userData.seats);
        seatTypeFromDB = userData.seatType;
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
  return { seatsFromDB, seatTypeFromDB };
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

export const updateSeatTypeOnDB = (seatType) => {
  console.log(seatType);

  const user = firebase.auth().currentUser;
  if (!user) {
    console.log("ERROR: couldn't sign in");
    return;
  }
  firebase
    .database()
    .ref(user.uid + "/seatType/")
    .set(seatType);
};


// export const fetchInitialPositions = async () => {
//   const user = firebase.auth().currentUser;
//   const dbRef = firebase.database().ref();
//   let updatedSeats = [];
//   await dbRef
//     .child(user.uid)
//     .child("seats")
//     .get()
//     .then((snapshot) => {
//       if (snapshot.exists()) {
//         updatedSeats = Object.values(snapshot.val());
//       } else {
//         console.log("No data available");
//       }
//     })
//     .catch((error) => {
//       console.error(error);
//     });
//   return updatedSeats;
// };

// export const fetchSeatType = async () => {
//   const user = firebase.auth().currentUser;
//   const dbRef = firebase.database().ref();
//   let seatType = "";
//   await dbRef
//     .child(user.uid)
//     .child("seatType")
//     .get()
//     .then((snapshot) => {
//       if (snapshot.exists()) {
//         seatType = snapshot.val();
//       } else {
//         console.log("No data available");
//       }
//     })
//     .catch((error) => {
//       console.error(error);
//     });
//   return seatType;
// };
