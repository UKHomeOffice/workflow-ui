import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useKeycloak } from '@react-keycloak/web';
import axios from 'axios';
import _ from 'lodash';
import ApplicationSpinner from '../../components/ApplicationSpinner';
import { useIsMounted, useAxios } from '../../utils/hooks';
import TaskList from './components/TaskList';

const TasksListPage = () => {
  const { t } = useTranslation();
  const [keycloak] = useKeycloak();
  const [data, setData] = useState({
    isLoading: true,
    tasks: [],
    total: 0,
    page: 0,
    maxResults: 20,
    search: '',

  });
  const isMounted = useIsMounted();
  const axiosInstance = useAxios();
  const dataRef = useRef(data.tasks);
  useEffect(() => {
    const source = axios.CancelToken.source();
    const loadTasks = async () => {
      if (axiosInstance) {
        try {
          const taskCountResponse = await axiosInstance({
            method: 'POST',
            url: '/camunda/engine-rest/task/count',
            cancelToken: source.token,
            data: {
              orQueries: [{
                candidateGroups: keycloak.tokenParsed.groups,
                assignee: keycloak.tokenParsed.email,
              }],
            },
          });

          const tasksResponse = await axiosInstance({
            method: 'POST',
            url: '/camunda/engine-rest/task',
            cancelToken: source.token,
            params: {
              maxResults: data.maxResults,
              firstResult: data.page,
            },
            data: {
              orQueries: [{
                candidateGroups: keycloak.tokenParsed.groups,
                assignee: keycloak.tokenParsed.email,
              }],
            },
          });

          const processDefinitionIds = _.uniq(tasksResponse
            .data.map((task) => task.processDefinitionId));

          const definitionResponse = await axiosInstance({
            method: 'GET',
            url: '/camunda/engine-rest/process-definition',
            params: {
              processDefinitionIdIn: processDefinitionIds.toString(),
            },
          });

          if (isMounted.current) {
            const merged = _.values(_.merge(_.keyBy(dataRef.current, 'id'),
              _.keyBy(tasksResponse.data, 'id')));

            if (definitionResponse.data && definitionResponse.data.length !== 0) {
              merged.forEach((task) => {
                const processDefinition = _.find(definitionResponse.data,
                  (definition) => definition.id === task.processDefinitionId);
                if (processDefinition) {
                  // eslint-disable-next-line no-param-reassign
                  task.category = processDefinition.category;
                }
              });
            }

            dataRef.current = merged;
            setData({
              isLoading: false,
              tasks: merged,
              total: taskCountResponse.data.count,
              page: data.page,
              maxResults: data.maxResults,
              search: data.search,
            });
          }
        } catch (e) {
          setData({
            isLoading: false,
            tasks: dataRef.current,
            total: 0,
            page: data.page,
            maxResults: data.maxResults,
            search: '',

          });
        }
      }
    };
    loadTasks().then(() => {});
    return () => {
      source.cancel('Cancelling request');
    };
  }, [setData, axiosInstance, data.maxResults,
    data.page, keycloak.tokenParsed.email, keycloak.tokenParsed.groups, isMounted, data.search]);

  if (data.isLoading) {
    return <ApplicationSpinner />;
  }
  return (
    <>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <span className="govuk-caption-l">{t('pages.tasks.list.caption')}</span>
          <h2 className="govuk-heading-l">
            {t('pages.tasks.list.size', { count: data.total })}
          </h2>
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <TaskList tasks={data.tasks} />
          {
            data.total > data.maxResults && data.tasks.length < (data.total)
              ? (
                <ul className="govuk-list">
                  <li>
                    <a
                      id="loadMore"
                      onClick={async (e) => {
                        e.preventDefault();
                        const page = data.page + data.maxResults;
                        setData({
                          ...data,
                          page,
                        });
                      }}
                      className="govuk-link"
                      href={`/tasks?firstResult=${data.page + data.maxResults}&maxResults=${data.maxResults}`}
                    >
                      {t('pages.forms.list.load-more')}
                    </a>
                  </li>
                </ul>
              ) : null
          }
        </div>
      </div>
    </>
  );
};

export default TasksListPage;
