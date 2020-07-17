import { map, mount, route } from 'navi';
import React from 'react';
import { withAuthentication } from '../../routes/utils';
import FormsListPage from './FormsListPage';
import FormPage from './FormPage';

const routes = mount({
  '/': map((request, context) => withAuthentication(route({
    title: context.t('pages.forms.list.title'),
    view: <FormsListPage />,
  }))),
  '/:formId': map((request, context) => withAuthentication(route({
    title: context.t('pages.form.title'),
    view: <FormPage formId={request.params.formId} />,
  }))),
});

export default routes;
