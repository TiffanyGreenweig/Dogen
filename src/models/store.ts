import { Instance, types, unprotect } from 'mobx-state-tree';
import { createContext, useContext } from 'react';
import { injectStores } from '@mobx-devtools/tools';
import GlobalModel from '@/models/global';
import HomeModel from '@/routes/home/models';
import NameModel from '@/routes/name/models';

// 全局store注册
export const RootStore = types.model('RootModel', {

  [GlobalModel.name]: types.optional(GlobalModel, {}),
  [HomeModel.name]: types.optional(HomeModel, {}),
  [NameModel.name]: types.optional(NameModel, {}),
});

// 初始化全局store
export function initializeStore() {
  const rootStore = RootStore.create();
  unprotect(rootStore);
  return rootStore;
}

const RootStoreContext = createContext<any>(null);
export const Provider = RootStoreContext.Provider;

export function useStore<T>(modal: string): Instance<T> {
  const store = useContext(RootStoreContext);
  if (store === null) {
    throw new Error('Store 数据不可为空, 请检查Provider组件是否包裹');
  }
  return modal ? injectStores(store?.[modal] || {}) : store;
}
