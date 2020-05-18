
import { map, redirect } from 'navi';

export const withAuthentication = (matcher) => map((request, context) => (context.isAuthenticated
  ? matcher
  : redirect(
    `/login?redirectTo=${encodeURIComponent(request.mountpath + request.search)}`,
  )));
