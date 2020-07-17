import { map, mount, route } from 'navi';
import React from 'react';
import { withAuthentication } from '../../routes/utils';
import TasksListPage from './TasksListPage';
import TaskPage from './TaskPage';

const routes = mount({
  '/': map((request, context) => withAuthentication(route({
    title: context.t('pages.tasks.list.title'),
    view: <TasksListPage />,
  }))),
  '/:taskId': map((request, context) => withAuthentication(route({
    title: context.t('pages.task.title'),
    view: <TaskPage taskId={request.params.taskId} />,
  }))),
});

export default routes;
