import { useState, useMemo } from "react";

import firebase from "firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { SeatingPlan } from "./components/SeatingPlan";
import { Droppable } from "./components/Droppable";

firebase.initializeApp({
  apiKey: "AIzaSyDv_nMpzqPHatfTCJLAJCXayvxkg0nhW2Q",
  authDomain: "seating-plan-9d314.firebaseapp.com",
  databaseURL:
    "https://seating-plan-9d314-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "seating-plan-9d314",
  storageBucket: "seating-plan-9d314.appspot.com",
  messagingSenderId: "161499233562",
  appId: "1:161499233562:web:dea857442a2b82282940a3",
  measurementId: "G-PVSQVFBHDN",
});

firebase
  .auth()
  .signInAnonymously()
  .then(() => {
    console.log("signed in");
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("sing in error");
  });

const auth = firebase.auth();

function App() {
  const [user] = useAuthState(auth);
  return <>{user ? <SeatingPlan /> : ""}</>;
}

export default App;
