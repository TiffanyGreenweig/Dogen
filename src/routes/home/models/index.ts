import { Instance, types } from 'mobx-state-tree';

// 导出namespace
export const HOME_NAMESPACE = 'HomeModel';

// 导出ts约束
export type HOME_TYPE_MODEL = Instance<typeof HomeModel>;

const HomeModel = types
  .model({
    recentClassrooms: types.optional(types.frozen<any>(), []),
  })
  .actions((self: any) => {
    // 重置数据
    const resetModel = () => {
      self.recentClassrooms = [];
    };
    return {
      resetModel,
    };
  })
  .named(HOME_NAMESPACE);

export default HomeModel;
