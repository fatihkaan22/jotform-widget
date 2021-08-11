import classNames from "classnames";
import { useState } from "react";

import { getTranslateStyle } from "./utils";

const SelectableItem = ({
  id,
  style,
  translate,
  innerComponent,
  selectSeat,
  unselectSeat,
  disabled,
  selected,
}) => {
  // const [selected, setSelected] = useState(false);
  const styleSelectable = getTranslateStyle(translate);

  const handleSelect = (event) => {
    if (!selected) {
      selectSeat(id);
    } else {
      unselectSeat(id);
    }
    // setSelected(!selected);
  };

  return (
    <div className="Selectable" style={styleSelectable}>
      <button
        className={classNames({ selected: selected, disabledSeat: disabled })}
        // {selected ? "selected" : undefined}
        style={style}
        onClick={disabled ? undefined : handleSelect}
      >
        {innerComponent.component}
      </button>
    </div>
  );
};

export default SelectableItem;
