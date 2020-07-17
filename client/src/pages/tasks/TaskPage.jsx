import React, {
  useEffect, useState,
} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { useKeycloak } from '@react-keycloak/web';
import { useNavigation } from 'react-navi';
import _ from 'lodash';
import { useIsMounted, useAxios } from '../../utils/hooks';
import ApplicationSpinner from '../../components/ApplicationSpinner';
import determinePriority from '../../utils/priority';
import DisplayForm from '../../components/form/DisplayForm';
import apiHooks from './hooks';

const TaskPage = ({ taskId }) => {
  const isMounted = useIsMounted();
  const { t } = useTranslation();
  const axiosInstance = useAxios();
  const navigation = useNavigation();
  const [keycloak] = useKeycloak();
  const [submitting, setSubmitting] = useState(false);

  const { submitForm } = apiHooks();
  const [task, setTask] = useState({
    isLoading: true,
    data: null,
  });
  useEffect(() => {
    const source = axios.CancelToken.source();
    const loadTask = async () => {
      if (axiosInstance) {
        try {
          const taskDataResponse = await axiosInstance({
            method: 'GET',
            url: `/ui/tasks/${taskId}`,
            cancelToken: source.token,
          });
          if (isMounted.current) {
            const {
              variables, form, processInstance, processDefinition, task: taskInfo,
            } = taskDataResponse.data;
            let formSubmission = {};
            const formVariableSubmissionName = form ? `${form.name}::submissionData`
              : null;

            if (taskInfo.variables) {
              Object.keys(taskInfo.variables).forEach((key) => {
                if (taskInfo.variables[key].type === 'Json') {
                  taskInfo.variables[key] = JSON.parse(taskInfo.variables[key].value);
                } else {
                  taskInfo.variables[key] = taskInfo.variables[key].value;
                }
              });
            }

            if (variables) {
              Object.keys(variables).forEach((key) => {
                if (variables[key].type === 'Json') {
                  variables[key] = JSON.parse(variables[key].value);
                } else {
                  variables[key] = variables[key].value;
                }
              });

              formSubmission = variables[formVariableSubmissionName]
                ? variables[formVariableSubmissionName] : variables.submissionData;
            }

            const updatedVariables = _.omit(variables || {}, ['submissionData', formVariableSubmissionName]);
            setTask({
              isLoading: false,
              data: {
                variables: updatedVariables,
                form,
                formSubmission,
                processInstance,
                processDefinition,
                task: taskInfo,
              },
            });
          }
        } catch (e) {
          if (isMounted.current) {
            setTask({
              isLoading: false,
              data: null,
            });
          }
        }
      }
    };
    loadTask().then(() => {});
    return () => {
      source.cancel('Cancelling request');
    };
  }, [axiosInstance, setTask, isMounted, taskId]);

  if (task.isLoading) {
    return <ApplicationSpinner />;
  }

  if (!task.data) {
    return null;
  }
  const { tokenParsed } = keycloak;

  let assignee = t('pages.task.current-assignee');
  const taskAssignee = task.data.task.assignee;

  if (!taskAssignee) {
    assignee = t('pages.task.unassigned');
  } else if (
    taskAssignee
    && taskAssignee !== tokenParsed.email
  ) {
    assignee = tokenParsed.email;
  }

  const {
    form, processInstance, task: taskInfo, processDefinition,
    formSubmission, variables,
  } = task.data;

  const handleOnFailure = () => {
    setSubmitting(false);
  };

  return (
    <>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full" id="taskName">
          <span className="govuk-caption-l">
            {processInstance.businessKey}
          </span>
          <h2 className="govuk-heading-l">
            {taskInfo.name}
          </h2>
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-quarter" id="category">
          <span className="govuk-caption-m govuk-!-font-size-19">{t('pages.task.category')}</span>
          <h4 className="govuk-heading-m govuk-!-font-size-19">
            {processDefinition.category}
          </h4>
        </div>
        <div className="govuk-grid-column-one-quarter" id="taskDueDate">
          <span className="govuk-caption-m govuk-!-font-size-19">{t('pages.task.due')}</span>
          <h4 className="govuk-heading-m govuk-!-font-size-19">
            { moment().to(moment(taskInfo.due)) }
          </h4>
        </div>
        <div className="govuk-grid-column-one-quarter" id="taskPriority">
          <span className="govuk-caption-m govuk-!-font-size-19">{t('pages.task.priority')}</span>
          <h4 className="govuk-heading-m govuk-!-font-size-19">
            { determinePriority(taskInfo.priority)}
          </h4>
        </div>
        <div className="govuk-grid-column-one-quarter" id="taskAssignee">
          <span className="govuk-caption-m govuk-!-font-size-19">{t('pages.task.assignee')}</span>
          <h4 className="govuk-heading-m govuk-!-font-size-19">{assignee}</h4>
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full" id="description">
          <p className="govuk-body">{taskInfo.description}</p>
        </div>
      </div>
      {form
        ? (
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-full" id="form">
              <DisplayForm
                submitting={submitting}
                form={form}
                handleOnCancel={async () => {
                  await navigation.navigate('/tasks');
                }}
                existingSubmission={formSubmission}
                interpolateContext={
                  {
                    processContext: {
                      variables,
                      instance: processInstance,
                      definition: processDefinition,
                    },
                    taskContext: taskInfo,
                  }
                }
                handleOnSubmit={(submission) => {
                  setSubmitting(true);
                  submitForm({
                    submission,
                    form,
                    taskId,
                    businessKey: processInstance.businessKey,
                    handleOnFailure,
                  });
                }}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="govuk-grid-row">
              <div className="govuk-grid-column-full">
                <div className="govuk-warning-text">
                  <span className="govuk-warning-text__icon" aria-hidden="true">!</span>
                  <strong className="govuk-warning-text__text">
                    <span className="govuk-warning-text__assistive">{t('warning')}</span>
                    {t('pages.task.no-form')}
                  </strong>
                </div>
              </div>
            </div>
            <div className="govuk-grid-row">
              <div className="govuk-grid-column-full">
                <button
                  className="govuk-button"
                  type="button"
                  onClick={() => {
                    submitForm({
                      submission: {},
                      form: {
                        name: 'no-form',
                      },
                      taskId,
                      businessKey: processInstance.businessKey,
                      handleOnFailure,
                    });
                  }}
                >
                  {t('pages.task.actions.complete')}
                </button>
              </div>
            </div>
          </>

        ) }
    </>
  );
};

TaskPage.propTypes = {
  taskId: PropTypes.string.isRequired,
};
export default TaskPage;
