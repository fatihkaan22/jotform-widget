export const getTranslateStyle = (translate) => {
  const shift = { x: 11, y: 81 };
  return {
    "--translate-x": `${translate?.x + shift.x ?? 0}px`,
    "--translate-y": `${translate?.y + shift.y ?? 0}px`,
  };
};
