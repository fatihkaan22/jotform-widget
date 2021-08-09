import firebase from "firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { SeatingPlan } from "./components/SeatingPlan";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";

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

const App = () => {
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
  const [user] = useAuthState(auth);
  return (
    <Router>
      <Switch>
        <Route path="/edit">{user ? <EditPage /> : ""}</Route>
        <Route path="/preview">{user ? <PreviewPage /> : ""}</Route>
        <Route path="/">{user ? <PreviewPage /> : ""}</Route>
      </Switch>
    </Router>
  );
};

const EditPage = () => {
  return <SeatingPlan editable={true} />;
};

const PreviewPage = () => {
  // TODO: If no tables, add message: click wizard to show...
  return <SeatingPlan editable={false} />;
};

export default App;