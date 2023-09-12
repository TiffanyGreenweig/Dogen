import { DIVINATION_FLAG, ROLES_ENUM } from '@constants/common';
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
    genImg: types.optional(types.frozen<string>(), ''),
  })
  .views(self => {
    return {
      get filterChatData() {
        const filterData = self?.chatData?.length > 2 ? (self?.chatData || [])?.slice(2) : self?.chatData
        return filterData;
      },
      // 根据chatGpt返回文案是否包含[卦象结果]自动触发卜卦
      get divinationFlag() {
        const lastAssistant = self?.chatData?.findLast((item: any) => item?.role === ROLES_ENUM.ASSISTANT)
        return lastAssistant?.content?.indexOf(DIVINATION_FLAG) > -1
      }
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

    const getGenImg = flow(function* (params?: any) {
      const genImg = yield REQUEST(
        'POST',
        `/divination/gen_img`,
      )(params);
      self.genImg = genImg
      return genImg
    });

    const resetDivinationData = () => {
      self.divination = '';
      self.genImg = '';
    }

    const updateChat = (data: any[]) => {
      console.log('====== updateChat', data)
      self.chatData = data;
    }
    // 重置数据
    const resetModel = () => {
      self.chatData = [];
      resetDivinationData()
    };
    return {
      modifyChat,
      updateChat,
      getDivination,
      getGenImg,
      resetDivinationData,
      resetModel,
    };
  })
  .named(HOME_NAMESPACE);

export default HomeModel;
