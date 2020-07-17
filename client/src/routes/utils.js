import { map, redirect } from 'navi';

// eslint-disable-next-line import/prefer-default-export
export const withAuthentication = (matcher) => map((request, context) => (context.isAuthenticated
  ? matcher
  : redirect(
    `/login?redirectTo=${encodeURIComponent(request.mountpath + request.search)}`,
  )));
