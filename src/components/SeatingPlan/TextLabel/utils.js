import firebase from 'firebase';

export const updateTextLabelOnDB = (text) => {
  const user = firebase.auth().currentUser;
  if (!user) {
    console.log("ERROR: couldn't sign in");
    return;
  }
  firebase.database().ref(`${user.uid}/texts/${text.id}`).set({
    id: text.id,
    x: text.x,
    y: text.y,
    width: text.width,
    height: text.height,
    value: text.value
  });
};
