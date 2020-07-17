import {
  map, lazy, mount, route, redirect,
} from 'navi';
import { withAuthentication } from './utils';

const routes = mount({
  '/': map((request, context) => withAuthentication(route({
    title: context.t('pages.home.title'),
    getView: () => import('../pages/home'),
  }))),
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
