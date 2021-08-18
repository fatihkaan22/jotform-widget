import React, { useEffect, useState } from 'react';

import { TransitionablePortal, Message } from 'semantic-ui-react';
import { MESSAGE_TIMEOUT } from '../../constants/common';

export const PortalMessage = ({
  open,
  onClose,
  header,
  text,
  error,
  warning,
  success,
  children
}) => {
  const [hide, setHide] = useState(false);
  useEffect(() => {
    const timeId = setTimeout(() => {
      if (open) {
        setHide(true);
        onClose();
      }
    }, MESSAGE_TIMEOUT);

    return () => {
      clearTimeout(timeId);
      setHide(false);
    };
  }, [open]);

  if (hide) return null;

  return (
    <>
      <TransitionablePortal open={open} onClose={onClose}>
        <Message error={error} warning={warning} success={success} className="info-portal">
          <Message.Header>{header}</Message.Header>
          {text ? <p>{text}</p> : undefined}
          {children}
        </Message>
      </TransitionablePortal>
    </>
  );
};
