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

  const submitForm = useCallback((submission, formInfo, id, handleOnFailure) => {
    if (formInfo) {
      const variables = {
        [formInfo.name]: {
          value: JSON.stringify(submission.data),
          type: 'json',
        },
      };
      axiosInstance.post(`/camunda/engine-rest/process-definition/key/${id}/submit-form`, {
        variables,
        businessKey: submission.data.businessKey,
      }).then(async () => {
        setAlertContext({
          type: 'form-submission',
          status: 'successful',
          message: t('pages.form.submission.success-message'),
          reference: `${submission.data.businessKey}`,
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
