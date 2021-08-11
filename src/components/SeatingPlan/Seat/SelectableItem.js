import classNames from "classnames";

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
  const styleSelectable = getTranslateStyle(translate);

  const handleSelect = (event) => {
    if (!selected) {
      selectSeat(id);
    } else {
      unselectSeat(id);
    }
  };

  return (
    <div className="Selectable" style={styleSelectable}>
      <button
        className={classNames({ selectedItem: selected, disabledSeat: disabled })}
        style={style}
        onClick={disabled ? undefined : handleSelect}
      >
        {innerComponent.component}
      </button>
    </div>
  );
};

export default SelectableItem;
