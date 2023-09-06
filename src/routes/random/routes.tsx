import { lazy } from 'react';

const Random = lazy(() => import('./containers'));

export const RandomRoutes = [
  {
    path: '/random',
    element: <Random />,
    title: 'random',
    key: 'random'
  }
];
