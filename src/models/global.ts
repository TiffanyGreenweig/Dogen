import { types, flow } from 'mobx-state-tree';

// 导出namespace
export const GLOBAL_NAMESPACE = 'GlobalModel';

// 导出ts约束
export type GLOBAL_TYPE_MODEL = typeof GlobalModel;

const GlobalModel = types
  .model({
    userInfo: types.optional(types.frozen<any>(), {}),
  })

  .views(self => {
    return {
      // 新手引导是否已通过  0 - 未完成 1-完成
      get newbieGuideFlag() {
        if (self?.userInfo && Object.prototype.hasOwnProperty.call(self?.userInfo, 'newbieGuideFlag')) {
          return !!self?.userInfo?.newbieGuideFlag;
        }
        // 默认通过，不展示引导
        return true;
      },
    };
  })
  .actions(self => {
    // 查询用户信息
    const getUserInfo = flow(function* () {
    });



    // reset
    const reset = () => {
      self.userInfo = {};
    };

    return {
      getUserInfo,
      reset,
    };
  })
  .named(GLOBAL_NAMESPACE);

export default GlobalModel;
