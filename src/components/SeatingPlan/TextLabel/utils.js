import firebase from 'firebase';

export const updateTextLabelOnDB = (text) => {
  const userId = window.JFid || firebase.auth().currentUser.uid;
  if (!userId) {
    console.log("ERROR: couldn't sign in");
    return;
  }
  firebase.database().ref(`${userId}/texts/${text.id}`).set({
    id: text.id,
    x: text.x,
    y: text.y,
    width: text.width,
    height: text.height,
    value: text.value
  });
};
