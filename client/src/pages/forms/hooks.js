import { useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from 'react-navi';
import { useAxios } from '../../utils/hooks';
import { SubmissionContext } from '../../utils/SubmissionContext';


export default () => {
  const axiosInstance = useAxios();
  const { t } = useTranslation();
  const { updateSubmissionContext } = useContext(SubmissionContext);
  const navigation = useNavigation();

  const submitForm = useCallback((submission, formInfo, id) => {
    if (formInfo && formInfo.data) {
      const variables = {
        [formInfo.data.name]: {
          value: JSON.stringify(submission.data),
          type: 'json',
        },
      };
      axiosInstance.post(`/camunda/engine-rest/process-definition/${id}/submit-form`, {
        variables,
        businessKey: submission.data.businessKey,
      }).then(async () => {
        updateSubmissionContext({
          status: 'successful',
          message: t('pages.form.submission.success-message'),
          reference: `${submission.data.businessKey}`,
        });
        await navigation.navigate('/');
      });
    }
  }, [axiosInstance, navigation, updateSubmissionContext, t]);

  return {
    submitForm,
  };
};
