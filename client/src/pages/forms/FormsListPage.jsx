import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigation } from 'react-navi';
import _, { debounce } from 'lodash';
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
    search: '',
  });

  useEffect(() => {
    const source = axios.CancelToken.source();
    const loadForms = async () => {
      if (axiosInstance) {
        const { page, maxResults } = forms;
        try {
          const params = {
            startableInTasklist: true,
            latestVersion: true,
            active: true,
          };

          if (forms.search && forms.search !== '') {
            params.nameLike = `%${forms.search}%`;
          }
          const formsResponse = await axiosInstance.get('/camunda/engine-rest/process-definition', {
            cancelToken: source.token,
            params: {
              ...params,
              maxResults: forms.maxResults,
              firstResult: forms.page,
            },
          });

          const formsCountResponse = await axiosInstance.get('/camunda/engine-rest/process-definition/count', {
            cancelToken: source.token,
            params,
          });

          if (isMounted.current) {
            setForms({
              isLoading: false,
              data: _.concat(forms.data, formsResponse.data),
              total: formsCountResponse.data.count,
              page,
              maxResults,
              search: forms.search,
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
              search: null,
            });
          }
        }
      }
    };

    loadForms().then(() => {});

    return () => {
      source.cancel('Cancelling request');
    };
  }, [axiosInstance, isMounted, setForms, forms.page, forms.maxResults, forms.search]);

  const search = debounce((text) => {
    setForms({
      ...forms,
      search: text,
      data: [],
      page: 0,
    });
  }, 500);

  return (
    forms.isLoading ? <ApplicationSpinner />
      : (
        <>
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">
              <span className="govuk-caption-l">{t('pages.forms.list.caption')}</span>
              <h2 className="govuk-heading-l">
                {t('pages.forms.list.size', { count: forms.total })}
              </h2>
            </div>
            <div className="govuk-grid-column-one-third">
              <div className="govuk-form-group">
                <label className="govuk-label" htmlFor="search">
                  {t('pages.forms.list.search')}
                </label>
                <input
                  onChange={(e) => {
                    search(e.target.value);
                  }}
                  className="govuk-input govuk-input--width-20"
                  placeholder={t('pages.forms.list.search-placeholder')}
                  id="search"
                  name="search"
                  type="text"
                />
              </div>
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
                {
                  forms.total > forms.maxResults && forms.data.length < forms.total
                    ? (
                      <li>
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a
                          id="loadMore"
                          onClick={async (e) => {
                            e.preventDefault();
                            setForms({
                              ...forms,
                              page: (forms.page + 1) * forms.maxResults,
                            });
                          }}
                          className="govuk-link"
                          href="#"
                        >
                          {t('pages.forms.list.load-more')}
                        </a>
                      </li>
                    ) : null
                }
              </ul>
            </div>
          </div>
        </>
      )
  );
};

export default FormsListPage;
