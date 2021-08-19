import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import emailjs, { init } from 'emailjs-com';
import { Helmet } from 'react-helmet';
import './style.css';
import { ACTION_STATUS_MAP } from '../../constants/common';

export const SendMail = () => {
  const [status, setStatus] = useState('sending');
  const { search } = useLocation();
  const { uid, id } = queryString.parse(search);

  const identifier = { uid: uid, id: id };

  const ACTIONS = Object.keys(ACTION_STATUS_MAP);

  const actionUrlMap = ACTIONS.reduce((result, action) => {
    const params = queryString.stringify({
      ...identifier,
      action: action
    });
    result[action] = `${window.location.origin}/approval?${params}`;
    return result;
  }, {});

  useEffect(() => {
    init('user_DS9qmbDlsSmsuMBGbDDHH');
    emailjs
      .send('service_jnfsw95', 'template_klud13v', {
        message: `uid: ${uid}, id: ${id}`,
        to: 'fatihkaansalgir@gmail.com',
        actionApprove: actionUrlMap.approve,
        actionDeny: actionUrlMap.deny
      })
      .then(
        (result) => {
          setStatus('success');
        },
        (error) => {
          console.log('ERROR: sending email');
          setStatus('error');
        }
      );
    console.log(uid, id);
  }, []);

  return (
    <>
      <Helmet>
        <style>{'body { background-color: #ecedf3; }'}</style>
      </Helmet>

      <div id="sendmail-wrapper">
        <div id="sendmail-image-wrapper">
          <img
            id="sendmail-image"
            src="https://cdn.jotfor.ms/img/Thankyou-iconV2.png?v=0.1"
          />
        </div>
        <br />
        <div id="sendmail-text">
          <h1>Reservation details have been sent to your email.</h1>
          <h3>Please review the request.</h3>
        </div>
      </div>
    </>
  );
};
