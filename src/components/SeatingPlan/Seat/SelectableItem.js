import classNames from "classnames";
import { useState } from "react";

import { getTranslateStyle } from "./utils";

const SelectableItem = ({ style, translate, innerComponent }) => {
  const [selected, setSelected] = useState(false);
  const styleSelectable = getTranslateStyle(translate);

  return (
    <div className="Selectable" style={styleSelectable}>
      <button
        className={selected && "selected"}
        style={style}
        onClick={() => setSelected(!selected)}
      >
        {innerComponent.component}
      </button>
    </div>
  );
};

export default SelectableItem;
