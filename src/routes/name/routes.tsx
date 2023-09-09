import { lazy } from 'react';

const Name = lazy(() => import('./containers'));

export const NameRoutes = [
  {
    path: '/name',
    element: <Name />,
    title: 'name',
    key: 'name'
  }
];
