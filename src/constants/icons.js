import React from 'react';
import { ReactComponent as IconTableCircle } from '../assets/table_circle.svg';
import { ReactComponent as IconTableSquare } from '../assets/table_square.svg';
import { ReactComponent as IconArmchair } from '../assets/armchair.svg';
import { ReactComponent as IconCircle } from '../assets/circle.svg';
import { ReactComponent as IconSquare } from '../assets/square.svg';

const SEAT_TYPES_MAP = {
  squareTable: {
    component: <IconTableSquare />,
    text: 'Square Table'
  },
  circleTable: {
    component: <IconTableCircle />,
    text: 'Circular Table'
  },
  armchair: {
    component: <IconArmchair />,
    text: 'Armchair'
  },
  circle: {
    component: <IconCircle />,
    text: 'Circle'
  },
  square: {
    component: <IconSquare />,
    text: 'Square'
  }
};

export default SEAT_TYPES_MAP;
