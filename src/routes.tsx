import { HomeRoutes } from '@/routes/home/routes';
import { RandomRoutes } from '@/routes/random/routes';
import { NameRoutes } from '@/routes/name/routes';

export const routes = [
  ...HomeRoutes,
  ...RandomRoutes,
  ...NameRoutes,
];
