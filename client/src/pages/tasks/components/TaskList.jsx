import React from 'react';
import PropTypes from 'prop-types';
import './TaskList.scss';
import { useNavigation } from 'react-navi';
import { useTranslation } from 'react-i18next';

const TaskList = ({ tasks }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  return (
    <div>
      <ol className="app-task-list">
        <li>
          <ul className="app-task-list__items">
            {tasks.map((task) => (
              <li key={task.id} className="app-task-list__item">
                <span className="app-task-list__task-name">
                  <a
                    href={`/task/${task.id}`}
                    onClick={async (e) => {
                      e.preventDefault();
                      await navigation.navigate(`/task/${task.id}`);
                    }}
                    aria-describedby={task.name}
                  >
                    {task.name}
                  </a>
                </span>
                <strong
                  className="govuk-tag app-task-list__task-open"
                >
                  {t('pages.tasks.list.status')}
                </strong>
              </li>
            ))}
          </ul>
        </li>
      </ol>
    </div>
  );
};

TaskList.defaultProps = {
  tasks: [],
};

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })),
};

export default TaskList;
