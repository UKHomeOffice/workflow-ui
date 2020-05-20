import { createMemoryNavigation } from 'navi';
import routes from './routes';

describe('Base routes', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  it.each`
      path                                                  | authenticated
      ${'/'}                                                | ${true}
      ${'/formId'}                                           | ${true}
 
    `('title and views for $path should be defined', async ({ path, authenticated }) => {
  const navigation = createMemoryNavigation({
    url: `${path}`,
    routes,
    context: {
      t: (key) => key,
      isAuthenticated: authenticated,
    },
  });
  const route = await navigation.getRoute();
  expect(route.error).toBeUndefined();
  expect(route.views).toBeDefined();
  expect(route.title).toBeDefined();
});
});
