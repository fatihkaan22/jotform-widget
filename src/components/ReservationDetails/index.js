import React, { useState, useEffect, useMemo } from 'react';
import firebase from 'firebase';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { fetchUserData } from '../SeatingPlan/utils';
import SEAT_TYPES_MAP from '../../constants/icons';
import { Seat } from '../SeatingPlan/Seat';
import { GRID } from '../../constants/common';
import { createSnapModifier, restrictToWindowEdges } from '@dnd-kit/modifiers';
import { TextLabel } from '../SeatingPlan/TextLabel';
import { Card, Icon, Image } from 'semantic-ui-react';
import QRCode from 'qrcode';

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
  const itemStyle = {
    width: GRID.SIZE * GRID.ITEM_WIDTH - 1,
    height: GRID.SIZE * GRID.ITEM_HEIGHT - 1
  };
  const [qrCode, setQrCode] = useState('');

  const fetchReservation = async ({ uid, id }) => {
    const dbRef = firebase.database().ref();
    const path = `${uid}/reservationList/${id}`;
    await dbRef
      .child(path)
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setReservationDetails({
            date: userData.date,
            time: userData.time,
            people: userData.people,
            seats: userData.seats
          });
        } else {
          console.log('No data available');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    const getData = async () => {
      const { seatsFromDB, seatTypeFromDB, textLabelsFromDB } =
        await fetchUserData(uid);
      setSeats(seatsFromDB ? seatsFromDB : []);
      setSelectedType(seatTypeFromDB ? seatTypeFromDB : defaultType);
      setTextLabels(textLabelsFromDB ? textLabelsFromDB : []);
    };
    getData();
    fetchReservation({ uid: uid, id: id });
  }, []); // []: only runs in initial render

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
      style={itemStyle}
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
      itemStyle={{ marginTop: -100 }}
    />
  ));

  return (
    <div>
      {id ? (
        <Card
          style={{ margin: 'auto', marginTop: 30, width: '30%', minWidth: 300 }}
        >
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
          <Card.Content extra style={{ height: 300 }}>
            <div style={{ marginTop: -100 }}>
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
