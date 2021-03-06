import React from 'react';
import classNames from 'classnames';

import { getTranslateStyle } from './utils';

const SelectableItem = ({
  id,
  style,
  translate,
  innerComponent,
  selectSeat,
  unselectSeat,
  disabled,
  selected
}) => {
  const styleSelectable = getTranslateStyle(translate);

  const handleSelect = () => {
    if (!selected) {
      selectSeat(id);
    } else {
      unselectSeat(id);
    }
  };

  const handleOnClick = () => {
    if (disabled || !selectSeat) {
      return undefined;
    }
    handleSelect();
  };

  return (
    <div className="Selectable" style={styleSelectable}>
      <button
        className={classNames({
          selectedItem: selected,
          disabledSeat: disabled
        })}
        style={style}
        onClick={handleOnClick}
      >
        {innerComponent.component}
      </button>
    </div>
  );
};

export default SelectableItem;
