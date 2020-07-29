import { createMemoryNavigation } from 'navi';
import routes from './index';

describe('Base routes', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  it.each`
      path                                                  | authenticated
      ${'/'}                                                | ${true}
      ${'/tasks'}                                           | ${true}
      ${'/forms'}                                           | ${true}
      ${'/tasks/id'}                                        | ${true}
      ${'/forms/id'}                                        | ${true}    
      ${'/login'}                                           | ${true}
      ${'/logout'}                                          | ${true}
      ${'/login?redirectTo=/'}                              | ${true}
      ${'/login'}                                           | ${false}   
      ${'/accessibility-statement'}                         | ${false}    
      ${'/privacy-and-cookie-policy'}                       | ${false}     
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
