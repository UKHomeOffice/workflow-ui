import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigation } from 'react-navi';
import { useAxios, useIsMounted } from '../../utils/hooks';
import ApplicationSpinner from '../../components/ApplicationSpinner';


const FormsListPage = () => {
  const { t } = useTranslation();
  const isMounted = useIsMounted();
  const axiosInstance = useAxios();
  const navigation = useNavigation();
  const [forms, setForms] = useState({
    isLoading: true,
    data: [],
    total: 0,
    page: 0,
    maxResults: 20,
  });

  useEffect(() => {
    const source = axios.CancelToken.source();
    const loadForms = async () => {
      const { page, maxResults } = forms;
      const params = {
        startableInTasklist: true,
        latestVersion: true,
        active: true,
        firstResult: page,
        maxResults,
      };
      if (axiosInstance) {
        try {
          const formsResponse = await axiosInstance.get('/camunda/engine-rest/process-definition', {
            cancelToken: source.token,
            params,
          });

          const formsCountResponse = await axiosInstance.get('/camunda/engine-rest/process-definition/count', {
            cancelToken: source.token,
            params,
          });

          if (isMounted.current) {
            setForms({
              isLoading: false,
              data: formsResponse.data,
              total: formsCountResponse.data.count,
              page,
              maxResults,
            });
          }
        } catch (e) {
          if (isMounted.current) {
            setForms({
              isLoading: false,
              data: [],
              total: 0,
              page,
              maxResults,
            });
          }
        }
      }
    };

    loadForms().then(() => {});

    return () => {
      source.cancel('Cancelling request');
    };
  }, [axiosInstance, isMounted, setForms, forms.page, forms.maxResults]);


  return (
    forms.isLoading ? <ApplicationSpinner />
      : (
        <>
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-one-half">
              <span className="govuk-caption-l">{t('pages.forms.list.caption')}</span>
              <h2 className="govuk-heading-l">
                {t('pages.forms.list.size', { count: forms.total })}
              </h2>
            </div>
          </div>
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-full">
              <ul className="govuk-list">
                {
                  forms.data.map((form) => {
                    const href = `/forms/${form.id}`;
                    return (
                      <li key={form.id}>
                        <a
                          onClick={async (e) => {
                            e.preventDefault();
                            await navigation.navigate(href);
                          }}
                          className="govuk-link"
                          href={
                            href
                          }
                        >
                          {form.name}
                        </a>
                      </li>
                    );
                  })
                }
              </ul>
            </div>
          </div>
        </>
      )
  );
};

export default FormsListPage;
