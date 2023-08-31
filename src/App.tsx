import React, { useEffect } from 'react';
import { Routes } from 'react-router-dom';
import { Route } from 'react-router';
import { initializeStore, Provider } from '@/models/store';
import Header from '@components/Header';

import { routes } from './routes';
import I18nProvider from '@/i18n/I18nProvider';

import { BASENAME } from '@constants/common';

import { HistoryRouter } from '@components/HistoryRouter';

import { seHistory } from '@utils/history';
import '@/utils/setPublicPath';

// import '@/assets/style/index.less';
import './App.less';
import ImConfig from '@components/ImConfig';
import { OrientationProvider } from '@components/OrientationProvider';
import useMedia from '@hooks/useMedia';
import CommonDataProvider from '@components/CommonDataProvider';

// 初始化全局store
const store = initializeStore();
const DomTitle = ({ item }: any) => {
  document.title = item?.title ? `${item?.title} - Lingostar` : 'Lingostar';
  return item.element;
};

const App = () => {
  // 新手引导显示的最小宽度需满足>1310px
  const minNewGuideWindow = useMedia(`(max-width: 1310px)`);
  useEffect(() => {
    // 加载三方js
    import(/* webpackChunkName: "load-third-script" */ '@/utils/loadScript').then((l: any) => {
      l?.loadTCaptcha?.();
      l?.loadFacebook?.();
    });
  }, []);
  return (
    <HistoryRouter basename={BASENAME} history={seHistory}>
      <OrientationProvider>
        <Provider value={store}>
          <CommonDataProvider
            data={{
              minNewGuideWindow,
            }}
          >
            <I18nProvider>
              <ImConfig>
                <Header>
                  <Routes>
                    {(routes || []).map((r: any) => (
                      <Route
                        {...r}
                        element={
                          <React.Suspense fallback={<div />}>
                            <DomTitle item={r} />
                          </React.Suspense>
                        }
                      />
                    ))}
                  </Routes>
                  {/*<RouterProvider router={routes} />*/}
                </Header>
              </ImConfig>
            </I18nProvider>
          </CommonDataProvider>
        </Provider>
      </OrientationProvider>
    </HistoryRouter>
  );
};

export default App;
