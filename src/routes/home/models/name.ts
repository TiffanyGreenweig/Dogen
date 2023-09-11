import { ROLES_ENUM } from '@constants/common';
import REQUEST from '@service/request';
import { flow, Instance, types } from 'mobx-state-tree';

// 导出namespace
export const NAME_NAMESPACE = 'NameModel';

// 导出ts约束
export type NAME_TYPE_MODEL = Instance<typeof NameModel>;

//
const NameModel = types
  .model({
    chatData: types.optional(types.frozen<any>(), []),
  })
  .actions((self: any) => {
    const modifyChat = flow(function* (params?: any) {
      const chatData = yield REQUEST(
        'POST',
        `/divination/naming`,
      )(params);
      const filterData = (chatData?.history || [])?.filter((item: IChatItem) => item?.role === ROLES_ENUM.USER || item?.role === ROLES_ENUM.ASSISTANT)
      self.chatData = filterData;
      return filterData;
    });
    const updateChat = (data: any[]) => {
      console.log('===== data', data)
      self.chatData = data
    }
    // 重置数据
    const resetModel = () => {
      self.chatData = [];
    };
    return {
      modifyChat,
      updateChat,
      resetModel,
    };
  })
  .named(NAME_NAMESPACE);

export default NameModel;
