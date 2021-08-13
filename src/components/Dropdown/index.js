import React from 'react';
import { Dropdown as DropdownUI } from 'semantic-ui-react';

export const Dropdown = (props) => {
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
      <DropdownUI
        fluid
        selection
        options={options}
        value={props.value}
        onChange={handleChange}
      />
    </>
  );
};
