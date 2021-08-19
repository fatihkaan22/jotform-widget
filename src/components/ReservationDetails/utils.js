import firebase from 'firebase';

export const fetchReservation = async ({ uid, id }) => {
  const dbRef = firebase.database().ref();
  const path = `${uid}/reservationList/${id}`;
  let reservationFromDB;
  await dbRef
    .child(path)
    .get()
    .then((snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        reservationFromDB = {
          date: userData.date,
          time: userData.time,
          people: userData.people,
          seats: userData.seats,
          status: userData.status
        };
      } else {
        console.log('No data available');
      }
    })
    .catch((error) => {
      console.error(error);
    });
  return reservationFromDB;
};
