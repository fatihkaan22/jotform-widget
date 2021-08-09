import { useState } from "react";
import { Input, Grid as GridUI, Button, Form, Popup } from "semantic-ui-react";

export const MultiAddPopup = ({ onSubmit }) => {
  const [state, setState] = useState({
    row: 1,
    col: 1,
    horizontalSpacing: 1,
    verticalSpacing: 1,
    spacingVisible: false,
  });

  const handleChange = (e, { name, value }) => {
    console.log("hand", name, value);
    setState({ ...state, [name]: parseInt(value), spacingVisible: true });
  };
  const handleSubmit = ({ row, col }) => {
    onSubmit(
      state.row,
      state.col,
      state.horizontalSpacing,
      state.verticalSpacing
    );
  };

  return (
    <Popup trigger={<Button icon="th" />} flowing hoverable position="bottom">
      <Form onSubmit={handleSubmit}>
        <GridUI className="multi-add-popup">
          <GridUI.Row>
            <GridUI.Column width={8}>
              <Form.Input
                size="mini"
                type="number"
                max={10}
                min={1}
                fluid
                label="Rows"
                name="row"
                value={state.row}
                onChange={handleChange}
              />
            </GridUI.Column>
            <GridUI.Column width={8}>
              <Form.Input
                size="mini"
                type="number"
                max={10}
                min={1}
                fluid
                label="Columns"
                name="col"
                value={state.col}
                onChange={handleChange}
              />
            </GridUI.Column>
          </GridUI.Row>
          {state.spacingVisible && (
            <GridUI.Row>
              <GridUI.Column width={8}>
                <Form.Input
                  size="mini"
                  type="number"
                  max={10}
                  min={0}
                  fluid
                  label="Horizontal Spacing"
                  name="horizontalSpacing"
                  value={state.horizontalSpacing}
                  onChange={handleChange}
                />
              </GridUI.Column>
              <GridUI.Column width={8}>
                <Form.Input
                  size="mini"
                  type="number"
                  max={10}
                  min={0}
                  fluid
                  label="Vertical Spacing"
                  name="verticalSpacing"
                  value={state.verticalSpacing}
                  onChange={handleChange}
                />
              </GridUI.Column>
            </GridUI.Row>
          )}
          <GridUI.Row>
            <GridUI.Column>
              <Button type="submit" floated="right" size="mini" type="submit">
                Add
              </Button>
            </GridUI.Column>
          </GridUI.Row>
        </GridUI>
      </Form>
    </Popup>
  );
};
