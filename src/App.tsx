import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { initializeStore, Provider } from '@/models/store';

import { routes } from './routes';

import '@/utils/setPublicPath';

import './App.less';

// 初始化全局store
const store = initializeStore();

const App = () => {
  return (
    <BrowserRouter>
      <Provider value={store}>
        <Routes>
          {(routes || []).map((r: any) => (
            <Route
              {...r}
              key={r.path}
            />
          ))}
        </Routes>
      </Provider>
    </BrowserRouter>
  );
};

export default App;
