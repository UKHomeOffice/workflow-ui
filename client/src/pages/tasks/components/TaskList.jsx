import React from 'react';
import PropTypes from 'prop-types';
import './TaskList.scss';
import { useNavigation } from 'react-navi';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';

const TaskList = ({ tasks }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const groupedByCategory = _.groupBy(tasks, (x) => x.category);

  return (
    <div>
      <ol className="app-task-list">

        {Object.keys(groupedByCategory).map((key, index) => (
          <div key={key}>
            <li>
              <h2 className="app-task-list__section">
                <span className="app-task-list__section-number">
                  {index + 1}
                  .
                </span>
                {' '}
                {key}
              </h2>
              <ul className="app-task-list__items">
                {groupedByCategory[key].map((task) => (
                  <li key={task.id} className="app-task-list__item">
                    <span className="app-task-list__task-name">
                      <a
                        href={`/task/${task.id}`}
                        onClick={async (e) => {
                          e.preventDefault();
                          await navigation.navigate(`/tasks/${task.id}`);
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
          </div>
        ))}
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
