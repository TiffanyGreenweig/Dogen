import { HomeRoutes } from '@/routes/home/routes';
import { ScheduleRoutes } from '@/routes/schedule/routes';
import { CourseRoutes } from '@/routes/course/routes';
/* PLOP_ROUTER_PATH_EXPORT */
import { ApplyRoutes } from '@/routes/apply/routes';
import { PaymentRoutes } from '@/routes/payment/routes';
import { ContractRoutes } from '@/routes/contract/routes';
import { ProfileRoutes } from '@/routes/profile/routes';
import { SessionRoutes } from '@/routes/session/routes';
import { LoginRoutes } from '@/routes/login/routes';
import { PolicyRoutes } from '@/routes/policy/routes';
import { WebsiteRoutes } from '@/routes/website/routes';
import { ReferralRoutes } from '@routes/referral/routes';

export const routes = [
  ...HomeRoutes,
  ...ScheduleRoutes,
  ...CourseRoutes,
  /* PLOP_ROUTER_REGISTER_EXPORT */
  ...ApplyRoutes,
  ...PaymentRoutes,
  ...ContractRoutes,
  ...ProfileRoutes,
  ...SessionRoutes,
  ...LoginRoutes,
  ...PolicyRoutes,
  ...WebsiteRoutes,
  ...ReferralRoutes,
];

// export const routes = createBrowserRouter(
//   ROUTES.map(({ path, element }) => {
//     return {
//       path,
//       element: (
//         <TabBar>
//           <Suspense fallback={<div>Loading</div>}>{element}</Suspense>
//         </TabBar>
//       ),
//     };
//   }),
// );
