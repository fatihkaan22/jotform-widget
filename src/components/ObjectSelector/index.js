import { useState } from "react";
import { Dropdown } from "semantic-ui-react";

export function ObjectSelector(props) {
  const options = Object.entries(props.options).map(([key, value]) => {
    return {
      text: value.text,
      key: key,
      value: key,
    };
  });

  const handleChange = (e, { value }) => {
    props.onChange(value);
  };

  return (
    <>
      <Dropdown
        placeholder="Select Object"
        fluid
        selection
        options={options}
        value={props.value}
        onChange={handleChange}
      />
    </>
  );
}
