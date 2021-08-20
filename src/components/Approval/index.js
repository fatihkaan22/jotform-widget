import React, { useEffect, useState } from 'react';
import firebase from 'firebase';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { ACTION_STATUS_MAP } from '../../constants/common';

export const Approval = () => {
  const [message, setMessage] = useState('');
  const { search } = useLocation();
  const { uid, id, action } = queryString.parse(search);

  const closeTab = () => {
    window.opener = null;
    window.open('', '_self');
    window.close();
  };

  useEffect(() => {
    const status = ACTION_STATUS_MAP[action];
    if (status) {
      firebase
        .database()
        .ref(`${uid}/reservationList/${id}/status`)
        .set(status, (error) => {
          if (error) {
            console.log('ERROR: setting reservation details');
            // setMessage('error');
          } else {
            // console.log('success');
            setMessage('success');
            closeTab();
          }
        });
    }
  }, []);

  return <h1>{message}</h1>;
};
