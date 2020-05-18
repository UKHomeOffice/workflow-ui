// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });


export const mockNavigate = jest.fn();
export const mockLogout = jest.fn();
export const mockLogin = jest.fn();

jest.mock('@react-keycloak/web', () => ({
  KeycloakProvider: ({ children }) => children,
  withKeycloak: (Component) => {
    // eslint-disable-next-line no-param-reassign
    Component.defaultProps = {
      ...Component.defaultProps,
      keycloak: {
        login: mockLogin,
      },
    };
    return Component;
  },
  useKeycloak: () => [
    {
      token: 'token',
      logout: mockLogout,
    },
    true,
  ],
}));

jest.mock('react-navi', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
  NotFoundBoundary: ({ children }) => children,
  useCurrentRoute: () => ({
    url: {
      pathname: 'test',
    },
  }),
}));
