// eslint-disable-next-line import/no-extraneous-dependencies
import FormioUtils from 'formiojs/utils';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import qs from 'querystring';
import Logger from './logger';

/*eslint-disable */
export const interpolate = (form, submission) => {
  FormioUtils.eachComponent(form.components, (component) => {
    if (component.type === 'file' && component.url !== '') {
      component.url = FormioUtils.interpolate(component.url, {
        data: submission,
      });
    }
    if (component.type === 'select' && component.data.url !== '') {
      component.data.url = FormioUtils.interpolate(component.data.url, {
        data: submission,
      });
    }
    component.label = FormioUtils.interpolate(component.label, {
      data: submission,
    });
    if (component.type === 'content') {
      component.html = FormioUtils.interpolate(component.html, {
        data: submission,
      });
    }
    if (component.type === 'htmlelement') {
      component.content = FormioUtils.interpolate(component.content, {
        data: submission,
      });
    }
    if (component.defaultValue) {
      component.defaultValue = FormioUtils.interpolate(component.defaultValue, {
        data: submission,
      });
    }
    if (component.customDefaultValue && component.customDefaultValue !== '') {
      component.defaultValue = FormioUtils.evaluate(component.customDefaultValue, {
        data: submission,
      }, 'value');
      component.customDefaultValue = '';
    }
  }, true);
  /* eslint-enable */
};

export const augmentRequest = (keycloak, formId) => ({
  priority: 0,
  async preRequest(requestArgs) {
    if (!requestArgs.opts) {
      // eslint-disable-next-line no-param-reassign
      requestArgs.opts = {};
    }
    if (!requestArgs.opts.header) {
      // eslint-disable-next-line no-param-reassign
      requestArgs.opts.header = new Headers();
      if (requestArgs.method !== 'upload') {
        requestArgs.opts.header.set('Accept', 'application/json');
        requestArgs.opts.header.set(
          'Content-type',
          'application/json; charset=UTF-8',
        );
      } else {
        requestArgs.opts.header.set(
          'Content-type',
          requestArgs.file.type,
        );
      }
    }
    let { token } = keycloak;
    const isExpired = jwtDecode(token).exp < new Date().getTime() / 1000;
    if (isExpired) {
      try {
        const response = await axios({
          method: 'POST',
          url: `${keycloak.authServerUrl}/realms/${keycloak.realm}/protocol/openid-connect/token`,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          data: qs.stringify({
            grant_type: 'refresh_token',
            client_id: keycloak.clientId,
            refresh_token: keycloak.refreshToken,
          }),
        });
        token = response.data.access_token;
      } catch (e) {
        Logger.error({
          token: keycloak.token,
          message: 'Failed refresh token',
          path: `/form/${formId}`,
          componentStack: e.message,
        });
      }
    }

    requestArgs.opts.header.set('Authorization', `Bearer ${token}`);
    if (!requestArgs.url) {
      // eslint-disable-next-line no-param-reassign
      requestArgs.url = '';
    }
    return Promise.resolve(requestArgs);
  },
});
