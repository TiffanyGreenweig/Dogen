import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { getDeviceId, getSid, getTrackCaInfo } from '@allschool/tracker';
import Logger from '@/utils/logger';
import Ping from '@/utils/ping';
import { LOCAL_STORAGE } from '@/constants/storage';

// sentry-trace 标识域名匹配
const TRACE_TARGETS = [
  /^\//,
  `${process.env.REACT_APP_BASE_API_URL?.replace(/https?:\/\//g, '')}`, // app 内接口请求固定地址
  window.location.host, // 动态取当前host
];

export const bootSentry = () => {
  if (process.env.SENTRY_DSN) {
    try {
      const p = new (Ping as any)({
        timeout: 3000,
        favicon: '/favicon.png',
      });
      p.ping(`${process.env.SENTRY_URL}_static/1659266705/sentry/images`, (err: any) => {
        if (!err) {
          /sim|online/.test(process.env.REACT_APP_PEPPA_ENV ?? 'qa') &&
            Sentry.init({
              dsn: `${process.env.SENTRY_DSN}`,
              integrations: [
                new BrowserTracing({
                  tracePropagationTargets: TRACE_TARGETS,
                }),
              ],
              release: process.env.WEB_APP_VERSION,
              environment: process.env.REACT_APP_PEPPA_ENV === 'online' ? 'production' : 'staging',
              async beforeSend(event) {
                try {
                  const sid = getSid();
                  const deviceId = getDeviceId();
                  const caInfo = getTrackCaInfo();
                  const user_id = (await localStorage.getItem(LOCAL_STORAGE.ACCESS_USER_ID)) || '';
                  event.user = event.user || {};
                  event.user.id = user_id;
                  event.user.sid = sid;
                  event.user.deviceId = deviceId;
                  event.user.caInfo = JSON.stringify(caInfo);

                  Sentry.setTag('c_user_id', user_id);
                  Sentry.setTag('c_device_id', deviceId);
                  Sentry.setTag('c_sid', sid);
                } catch (error) {
                  //
                }
                return event;
              },
              // We recommend adjusting this value in production, or using tracesSampler
              // for finer control
              tracesSampleRate: 1.0,
            });
        }
      });
    } catch (e) {
      Logger.error('Sentry 初始化异常', e);
    }
  }
};
