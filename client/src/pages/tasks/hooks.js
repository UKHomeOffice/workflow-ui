import { useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from 'react-navi';
import { useAxios } from '../../utils/hooks';
import { AlertContext } from '../../utils/AlertContext';

export default () => {
  const axiosInstance = useAxios();
  const { t } = useTranslation();
  const { setAlertContext } = useContext(AlertContext);
  const navigation = useNavigation();

  const submitForm = useCallback(({
    submission, form, taskId, businessKey, handleOnFailure,
  }) => {
    if (form) {
      const variables = {
        [form.name]: {
          value: JSON.stringify(submission.data),
          type: 'json',
        },
      };
      axiosInstance.post(`/camunda/engine-rest/task/${taskId}/submit-form`, {
        variables,
        businessKey,
      }).then(async () => {
        setAlertContext({
          type: 'form-submission',
          status: 'successful',
          message: t('pages.task.submission.success-message'),
          reference: `${businessKey}`,
        });
        await navigation.navigate('/');
      }).catch(() => {
        handleOnFailure();
      });
    }
  }, [axiosInstance, navigation, setAlertContext, t]);

  return {
    submitForm,
  };
};
