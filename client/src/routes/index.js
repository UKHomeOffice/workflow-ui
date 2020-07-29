import {
  map, lazy, mount, route, redirect,
} from 'navi';
import React from 'react';
import { withAuthentication } from './utils';
import AccessibilityStatement from '../components/AccessibilityStatement';
import PrivacyAndCookiePolicy from '../components/PrivacyAndCookiePolicy';

const routes = mount({
  '/': map((request, context) => withAuthentication(route({
    title: context.t('pages.home.title'),
    getView: () => import('../pages/home'),
  }))),
  '/accessibility-statement': map((request, context) => route({
    title: context.t('pages.task.title'),
    view: <AccessibilityStatement />,
  })),
  '/privacy-and-cookie-policy': map((request, context) => route({
    title: context.t('pages.privacy.title'),
    view: <PrivacyAndCookiePolicy />,
  })),
  '/forms': lazy(() => import('../pages/forms/routes')),
  '/tasks': lazy(() => import('../pages/tasks/routes')),
  '/logout': map((request, context) => withAuthentication(route({
    title: context.t('logout'),
    getView: () => import('../components/header/Logout'),
  }))),
  '/login': map(async (request, context) => (context.isAuthenticated
    ? redirect(
      request.params.redirectTo
        ? decodeURIComponent(request.params.redirectTo)
        : '/',
    )
    : lazy(() => import('../pages/home/LoginPage')))),
});

export default routes;
