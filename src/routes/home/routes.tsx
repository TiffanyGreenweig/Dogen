import { lazy } from 'react';

const Home = lazy(() => import('./containers'));

export const HomeRoutes = [
  {
    path: '/',
    element: <Home />,
    title: 'Home',
    key: 'home'
  }
];
