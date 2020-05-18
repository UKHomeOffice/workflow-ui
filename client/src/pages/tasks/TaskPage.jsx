import React from 'react';
import PropTypes from 'prop-types';

const TaskPage = ({ taskId }) => <div>{taskId}</div>;


TaskPage.propTypes = {
  taskId: PropTypes.string.isRequired,
};
export default TaskPage;
