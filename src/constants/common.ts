import { FormLayout } from 'antd/es/form/Form';

// 不需要拦截登录的url地址
export const AUTH_ROUTER_URL = ['/login', '/reset', '/set', '/register', '/website'];
export const SIMPLE_HEADRE = ['/reset', '/set', '/register'];
export const NO_HEADRE = ['/login', '/register', '/terms/app/:lang/privacy', '/terms/app/:lang/service', '/website'];
export const NEW_TEACHER_HEADER = ['/new'];
export const NO_ROTATE = ['/register', '/login', '/terms/app/:lang/privacy', '/terms/app/:lang/service'];
// 有新手引导页面
export const GUIDE_ROTATE = ['/contract', '/schedule', '/course', '/profile'];
export const TOKEN = 'userToken';

// 用户默认头像
export const USER_IMG = `${process.env.REACT_APP_ASSETS_PREFIX}/assets/aa2d8ec9-5118-4ed6-8d7f-db661bd53b4a.png`;

// 防抖市场
export const DEBOUNCE_TIME = 400;

export const LOCAL_AREA_CODE = '86';

export const LANGUAGE = 'language';

export const PAGE_SIZE_DEFAULT = 10;
export const PAGE_SIZE_SEARCH = 200;
export const PAGE_NUM_DEFAULT = 1;

// 初始查询
export const INIT_PAGE = {
  pageNum: PAGE_NUM_DEFAULT,
  pageSize: PAGE_SIZE_DEFAULT,
};

// 模糊搜索
export const SEARCH_PAGE = {
  pageNum: PAGE_NUM_DEFAULT,
  pageSize: PAGE_SIZE_SEARCH,
};

interface IFormLayout {
  SEARCH_DEFAULT: FormLayout;
  FORM_DEFAULT: FormLayout;
}
export const FORM_LAYOUT: IFormLayout = {
  SEARCH_DEFAULT: 'vertical', // 搜索框
  FORM_DEFAULT: 'vertical', // 表单填写
};

// 加密/解密用户账号类型
export const USER_ACCOUNT_TYPE = {
  EMAIL: 1,
  PHONE: 2,
};

// 字典常量枚举
export const DICT_TYPE_LIST = {
  GENDER: 1100, // 性别
  DEGREE: 100010004, // 学历
  NATIONALITY: 40004, // 国籍
  CERTIFICATE: 1103, // 教学证书
  CHANNEL_SOURCE: 100010011, // 渠道来源
  EXPERIENCE: 100010012, // 教学经验
  HAS_CERTIFICATE: 100010013, // 是否有教师资格证
  SCHEDULE_REQUEST_REFUSE: 8002, //日历拒绝求课原因枚举
};

// 日志业务类型枚举
export const BIZ_ENUM = {
  LEARNING_PLAN: '100',
  CLASSROOM: '200',
  TEACHER: '300',
  COURSE: '400',
  SCHEDULE: '500',
};

// 必填信息提示类型
export const REQUIRE_MESSAGE_TYPE = {
  UPLOAD: 'UPLOAD',
  ENTER: 'ENTER',
  SELECT: 'SELECT',
  FORMATE_ERROR: 'FORMATE_ERROR',
};

// 公共文案
export const GLOBAL_MESSAGE_TYPE = {
  // 确认删除
  DELETE_CONFIRM: 'DELETE_CONFIRM',
  // 操作成功
  OPERATE_SUCCESS: 'OPERATE_SUCCESS',
  // 错误事件 < 当前时间
  WRONG_TIME: 'WRONG_TIME',
};
// 唤起课堂类型
export const CLASSROOM_TYPE = {
  PRACTICE: 'open-teacher-grint-classroom',
  FORMAL: 'open-teacher-classroom',
};
// 唤起app场景
export enum TEACHER_APP_SCENE {
  HOME = 'open-teacher-home', // 打开教师端进入首页
  EVALUATE = 'open-teacher-evaluate', // 打开教师评价学生
  PRACTICE_CLASSROOM = 'open-teacher-grint-classroom', // 进入教室磨课课堂
  CLASSROOM = 'open-teacher-classroom', // 进入教室课堂
}

/**
 * 上课状态
 */
export const CLASSROOM_STATUS = {
  WAIT: 0, // 待上课
  IN_CLASS: 5, // 上课中
  OFF_CLASS: 10, // 已下课
  VACATE_CLASS: 15, // 超时未上课
  CANCEL: 20, // 已取消
};
/**
 * 课堂类型类型
 */
export const CLASSROOM_TYPE_ENUM = {
  FLEXIBLE: 1, // 灵活课堂
  CYCLE: 2, // 周期课堂
  TUTORIAL: 3, // 补课课堂
};

/**
 * 课程类型类型
 */
export const COURSE_TYPE = {
  SYSTEMATIC: 1, // 系统课
  AUDITIONS: 2, // 试听课
};

// 字典枚举
export const DICT_ENUM = {
  COURSE_TYPE: 100010001, // 课程类型
  LEVEL: 100010002, // 课程level
  CLASSROOM_STATUS: 1603, // 课堂状态
};

// basename
export const BASENAME = '/teach';

// 注册教师状态枚举
export enum REGISTRATION_STATUS_ENUM {
  PENDING = 1, // 注册中
  DONE = 2, // 注册完成
}

/**
 * 不需要进行拦截校验
 */
export const NO_NEED_CHECK_ENTRY_LIST_ROUTE = [
  // 政策相关
  '/terms/app/:lang/privacy',
  '/terms/app/:lang/service',
  '/login',
  '/register',
];
// 教师类型
export const TEACHER_TYPE = {
  EU: 1, // 英美
  PH: 2, // 菲教
};
