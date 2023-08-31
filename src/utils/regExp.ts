/**
 * 邮箱验证
 * 1 邮箱名支持中英文、特殊英文字符（/ - _ .）
 * 2 @ 前/后不允许出现特殊字符 .
 * 3 @ 后域名支持中英文
 */
export const regExpEmail = new RegExp(
  '^\\s*[\\w\u4e00-\u9fa5]*[.]*[\\w\u4e00-\u9fa5]+@[a-zA-Z0-9\u4e00-\u9fa5]+(?:[-.][a-zA-Z0-9\u4e00-\u9fa5]+)*\\.[a-zA-Z\u4e00-\u9fa5]+\\s*$',
);

/**
 * 密码强度验证
 *  至长度8-100个字符，至少包含一个数字和一个字母
 */
export const regExpPassword = /(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]*).{8,100}/;

/**
 *  数字
 */
export const regExpNum = /\D/g;
