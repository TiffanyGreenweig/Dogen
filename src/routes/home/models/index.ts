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
    divination: types.optional(types.frozen<string>(), ''),
  })
  .views(self => {
    return {
      get filterChatData() {
        const filterData = (self?.chatData || [])?.filter((item: IChatItem) => item?.role === ROLES_ENUM.USER || item?.role === ROLES_ENUM.ASSISTANT)
        return filterData;
      },
    };
  })
  .actions((self: any) => {
    const modifyChat = flow(function* (params?: any) {
      const chatData = yield REQUEST(
        'POST',
        `/divination/chat`,
      )(params);
      self.chatData = chatData?.history || [];
    });

    // 用爻获取卦
    const getDivination = flow(function* (params?: any) {
      const divination = yield REQUEST(
        'POST',
        `/divination/symbol`,
      )(params);
      self.divination = divination
      return divination
    });

    const resetDivination = () => {
      self.divination = '';
    }

    const updateChat = (data: any[]) => {
      console.log('====== updateChat', data)
      self.chatData = data;
    }
    // 重置数据
    const resetModel = () => {
      self.chatData = [];
      resetDivination()
    };
    return {
      modifyChat,
      updateChat,
      getDivination,
      resetDivination,
      resetModel,
    };
  })
  .named(HOME_NAMESPACE);

export default HomeModel;
