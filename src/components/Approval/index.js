import React, { useEffect, useState } from 'react';
import firebase from 'firebase';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { ACTION_STATUS_MAP } from '../../constants/common';

export const Approval = () => {
  const [message, setMessage] = useState('');
  const { search } = useLocation();
  const { uid, id, action } = queryString.parse(search);

  useEffect(() => {
    const status = ACTION_STATUS_MAP[action];
    if (status) {
      firebase
        .database()
        .ref(`${uid}/reservationList/${id}/status`)
        .set(status);
    }
  }, []);

  return <h1>{message}</h1>;
};
