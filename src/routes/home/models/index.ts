import { ROLES_ENUM } from '@constants/common';
import REQUEST from '@service/request';
import { flow, Instance, types } from 'mobx-state-tree';

// 导出namespace
export const HOME_NAMESPACE = 'HomeModel';

// 导出ts约束
export type HOME_TYPE_MODEL = Instance<typeof HomeModel>;

//
const HomeModel = types
  .model({
    chatData: types.optional(types.frozen<any>(), []),
  })
  .actions((self: any) => {
    const modifyChat = flow(function* (params?: any) {
      const chatData = yield REQUEST(
        'POST',
        `/divination/chat`,
      )(params);
      console.log('====== chatData', chatData)
      const filterData = (chatData?.history || [])?.filter((item: IChatItem) => item?.role === ROLES_ENUM.USER || item?.role === ROLES_ENUM.ASSISTANT)
      self.chatData = filterData;
      return filterData;
    });
    // 重置数据
    const resetModel = () => {
      self.chatData = [];
    };
    return {
      modifyChat,
      resetModel,
    };
  })
  .named(HOME_NAMESPACE);

export default HomeModel;
