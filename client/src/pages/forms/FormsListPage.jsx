import React, {
  useEffect, useRef, useState,
} from 'react';
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

  const dataRef = useRef(forms.data);
  useEffect(() => {
    const source = axios.CancelToken.source();
    const loadForms = async () => {
      if (axiosInstance) {
        try {
          const params = {
            startableInTasklist: true,
            latestVersion: true,
            active: true,
          };

          if (forms.search && (forms.search !== '' && forms.search.length > 3)) {
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
            const merged = _.merge(_.keyBy(dataRef.current, 'id'),
              _.keyBy(formsResponse.data, 'id'));
            dataRef.current = merged;
            setForms({
              isLoading: false,
              data: _.values(merged),
              total: formsCountResponse.data.count,
              page: forms.page,
              maxResults: forms.maxResults,
              search: forms.search,
            });
          }
        } catch (e) {
          if (isMounted.current) {
            setForms({
              isLoading: false,
              data: [],
              total: 0,
              page: forms.page,
              maxResults: forms.maxResults,
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
  }, [axiosInstance, isMounted, setForms, forms.page,
    forms.maxResults, forms.search]);

  const search = debounce((text) => {
    dataRef.current = [];
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
                <span id="search-hint" className="govuk-hint">
                  {t('pages.forms.list.search-hint')}
                </span>
                <input
                  onChange={(e) => {
                    search(e.target.value);
                  }}
                  spellCheck="false"
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
                    const href = `/forms/${form.key}`;
                    return (
                      <li key={form.id} className="govuk-!-margin-bottom-2">
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
                        <p className="govuk-body govuk-!-margin-top-1">{form.description}</p>
                        <hr className="govuk-section-break govuk-section-break--visible" />
                      </li>

                    );
                  })
                }
                {
                  forms.total > forms.maxResults && forms.data.length < (forms.total)
                    ? (
                      <li>
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a
                          id="loadMore"
                          onClick={async (e) => {
                            e.preventDefault();
                            const page = forms.page + forms.maxResults;
                            setForms({
                              ...forms,
                              page,
                            });
                          }}
                          className="govuk-link"
                          href={`/forms?firstResult=${forms.page + forms.maxResults}&maxResults=${forms.maxResults}`}
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
