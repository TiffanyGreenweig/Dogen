export enum ROLES_ENUM {
  USER = 'user', // 用户
  ASSISTANT = 'assistant' // 机器人
}

export const DEFAULT_AVATAR = 'https://tse1-mm.cn.bing.net/th/id/OIP-C.FU4s9rpj6QniDh1P3Ck3qgAAAA?pid=ImgDet&rs=1'

export const USER_AVATAR = 'https://www.mphome.cn/up/img/4/b13066786395773.jpg'

// export const ASSISTANT_AVATAR = 'https://tupian.qqw21.com/article/UploadPic/2018-8/2018821122526606.jpg'
export const ASSISTANT_AVATAR = 'https://hf-sim.allschoolcdn.com/sim/sparkenglish-sv/groot-teaching/teach/useInfo/1693993171818/1693993171819/2023-09-06/42d11b6f-ec28-48ee-c2d9-5e2142f076d2.jpg'

export const DATA_ENUM: any = {
  [ROLES_ENUM.USER]: {
    avatar: USER_AVATAR,
    name: '幸运儿',
  },
  [ROLES_ENUM.ASSISTANT]: {
    avatar: ASSISTANT_AVATAR,
    name: '大师',
  },
  'default': {
    avatar: DEFAULT_AVATAR,
    name: '神秘人',
  },
  'system': {
    avatar: DEFAULT_AVATAR
  }
}

// 爻
export const HEXAGRAM = {
  YIN: 0, // 阴 - -
  YANG: 1, // 阳 -
}

// 单枚硬币正反
export enum COIN_TYPE {
  HEAD = 3, // 正
  TAIL = 2, // 反
}
