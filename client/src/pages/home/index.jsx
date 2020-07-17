import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from 'react-navi';
import { useKeycloak } from '@react-keycloak/web';
import axios from 'axios';
import Card from './components/Card';
import { useIsMounted, useAxios } from '../../utils/hooks';

const Home = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [keycloak] = useKeycloak();

  const axiosInstance = useAxios();

  const [formsCount, setFormsCount] = useState({
    isLoading: true,
    count: 0,
  });

  const [tasksCount, setTasksCount] = useState({
    isLoading: true,
    count: 0,
  });
  const isMounted = useIsMounted();
  useEffect(() => {
    const source = axios.CancelToken.source();
    if (axiosInstance) {
      axiosInstance.get('/camunda/engine-rest/process-definition/count', {
        cancelToken: source.token,
        params: {
          startableInTasklist: true,
          latestVersion: true,
          active: true,
        },
      }).then((response) => {
        if (isMounted.current) {
          setFormsCount({
            isLoading: false,
            count: response.data.count,
          });
        }
      }).catch(() => {
        if (isMounted.current) {
          setFormsCount({
            isLoading: false,
            count: 0,
          });
        }
      });

      axiosInstance({
        method: 'POST',
        url: '/camunda/engine-rest/task/count',
        cancelToken: source.token,
        data: {
          orQueries: [{
            candidateGroups: keycloak.tokenParsed.groups,
            assignee: keycloak.tokenParsed.email,
          }],
        },
      }).then((response) => {
        if (isMounted.current) {
          setTasksCount({
            isLoading: false,
            count: response.data.count,
          });
        }
      }).catch(() => {
        if (isMounted.current) {
          setTasksCount({
            isLoading: false,
            count: 0,
          });
        }
      });
    }

    return () => {
      source.cancel('Cancelling request');
    };
  }, [axiosInstance, setFormsCount, setTasksCount, isMounted,
    keycloak.tokenParsed.groups,
    keycloak.tokenParsed.email]);

  return (
    <div className="govuk-!-margin-top-7">
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <h2 className="govuk-heading-l">
            <span className="govuk-caption-l">{t('pages.home.header')}</span>
            {keycloak.tokenParsed.given_name}
            {' '}
            {keycloak.tokenParsed.family_name}
          </h2>
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-half">
          <Card
            href="/forms"
            isLoading={formsCount.isLoading}
            count={formsCount.count}
            handleClick={async () => {
              await navigation.navigate('/forms');
            }}
            footer={t('pages.home.card.forms.footer')}
          />
        </div>
        <div className="govuk-grid-column-one-half">
          <Card
            href="/tasks"
            count={tasksCount.count}
            isLoading={tasksCount.isLoading}
            handleClick={async () => {
              await navigation.navigate('/tasks');
            }}
            footer={t('pages.home.card.tasks.footer')}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
