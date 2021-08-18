import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { createSnapModifier, restrictToWindowEdges } from '@dnd-kit/modifiers';
import { Card, Icon, Image } from 'semantic-ui-react';
import QRCode from 'qrcode';
import { fetchUserData, getItemStyle } from '../SeatingPlan/utils';
import SEAT_TYPES_MAP from '../../constants/icons';
import { Seat } from '../SeatingPlan/Seat';
import { GRID } from '../../constants/common';
import { TextLabel } from '../SeatingPlan/TextLabel';
import './style.css';
import { fetchReservation } from './utils';

export const ReservationDetails = (props) => {
  const { search } = useLocation();
  const { uid, id } = queryString.parse(search);
  const [reservationDetails, setReservationDetails] = useState({
    date: '',
    time: '',
    people: '',
    seats: []
  });
  const [seats, setSeats] = useState([]);
  const [textLabels, setTextLabels] = useState([]);
  const defaultType = Object.keys(SEAT_TYPES_MAP)[0];
  const [selectedType, setSelectedType] = useState(defaultType);
  const snapToGrid = useMemo(() => createSnapModifier(GRID.SIZE), [GRID.SIZE]);
  const [qrCode, setQrCode] = useState('');

  useEffect(() => {
    const getData = async () => {
      const { seatsFromDB, seatTypeFromDB, textLabelsFromDB } =
        await fetchUserData(uid);
      setSeats(seatsFromDB ? seatsFromDB : []);
      setSelectedType(seatTypeFromDB ? seatTypeFromDB : defaultType);
      setTextLabels(textLabelsFromDB ? textLabelsFromDB : []);
    };
    const getReservationDetails = async () => {
      const reservationFromDB = await fetchReservation({ uid: uid, id: id });
      setReservationDetails(reservationFromDB);
    };
    getData();
    getReservationDetails();
  }, []);

  useEffect(() => {
    QRCode.toDataURL(window.location.href)
      .then((url) => {
        console.log(url);
        setQrCode(url);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const seatList = seats.map((seat) => (
    <Seat
      id={seat.id}
      key={seat.id}
      coordinates={{ x: seat.x, y: seat.y }}
      style={getItemStyle()}
      modifiers={[snapToGrid, restrictToWindowEdges]}
      gridSize={GRID.SIZE}
      draggable={false}
      seatType={SEAT_TYPES_MAP[selectedType]}
      selected={reservationDetails.seats.includes(seat.id)}
    />
  ));

  const textLabelList = textLabels.map((textLabel) => (
    <TextLabel
      id={textLabel.id}
      key={textLabel.id}
      coordinates={{ x: textLabel.x, y: textLabel.y }}
      modifiers={[snapToGrid, restrictToWindowEdges]}
      gridSize={GRID.SIZE}
      editable={false}
      value={textLabel.value}
      initialWidth={textLabel.width}
      initialHeight={textLabel.height}
    />
  ));

  return (
    <div>
      {id ? (
        <Card id="reservation-details-card">
          <Image src={qrCode} />
          <Card.Content>
            <Card.Header>Reservation Details</Card.Header>
            <Card.Description>
              <Icon name="calendar" />
              {reservationDetails.date}
              <br />
              <Icon name="time" />
              {reservationDetails.time}
              <br />
              <Icon name="user" />
              {reservationDetails.people}
            </Card.Description>
          </Card.Content>
          <Card.Content extra id="reservation-details-extra">
            <div id="reservation-details-seat-wrapper">
              {seatList}
              {textLabelList}
            </div>
          </Card.Content>
        </Card>
      ) : (
        'Not found'
      )}
    </div>
  );
};
