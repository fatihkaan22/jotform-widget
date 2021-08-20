import React from 'react';
import firebase from 'firebase';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { SeatingPlan } from './components/SeatingPlan';
import { ReservationDetails } from './components/ReservationDetails';
import { SendMail } from './components/SendMail';
import { Approval } from './components/Approval';

firebase.initializeApp({
  apiKey: 'AIzaSyDv_nMpzqPHatfTCJLAJCXayvxkg0nhW2Q',
  authDomain: 'seating-plan-9d314.firebaseapp.com',
  databaseURL:
    'https://seating-plan-9d314-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'seating-plan-9d314',
  storageBucket: 'seating-plan-9d314.appspot.com',
  messagingSenderId: '161499233562',
  appId: '1:161499233562:web:dea857442a2b82282940a3',
  measurementId: 'G-PVSQVFBHDN'
});

const App = () => {
  firebase
    .auth()
    .signInAnonymously()
    .then(() => {
      console.log('signed in');
    })
    .catch((error) => {
      console.log(`ERROR: sing in ${error.code} : ${error.message}`);
    });

  const auth = firebase.auth();
  const [user] = useAuthState(auth);

  const { formID } = window.JFCustomWidget.getWidgetData();
  window.JFid = formID;
  console.log('JFid', window.JFid);

  return (
    <Router>
      <Switch>
        <Route path="/reservation/">
          <ReservationDetails />
        </Route>
        <Route path="/sendmail/">
          <SendMail />
        </Route>
        <Route path="/approval/">
          <Approval />
        </Route>
        <Route path="/edit">{user ? <EditPage /> : ''}</Route>
        <Route path="/preview">{user ? <PreviewPage /> : ''}</Route>
        <Route path="/">{user ? <PreviewPage /> : ''}</Route>
      </Switch>
    </Router>
  );
};

const EditPage = () => {
  return <SeatingPlan editable={true} />;
};

const PreviewPage = () => {
  return <SeatingPlan editable={false} />;
};

export default App;
