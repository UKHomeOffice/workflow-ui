const determinePriority = (priority) => {
  let result = null;
  switch (priority) {
    case 50:
      result = 'Low';
      break;
    case 100:
      result = 'Medium';
      break;
    default:
      result = 'High';
  }
  return result;
};

export default determinePriority;
