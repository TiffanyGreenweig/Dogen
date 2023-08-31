// 图片格式
export const PICTURE_TYPE = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'];
// todo  .3gp, .dv, .m3u8, .rm, .rmvb, .swf 以上视频格式不支持上传
// 所有视频格式
export const VIDEO_TYPE = [
  'mp4',
  'mkv',
  'asf',
  'avi',
  'flv',
  'f4v',
  'm4v',
  'mov',
  'mpg',
  'mpeg',
  'mts',
  'ogg',
  'vob',
  'wmv',
  'webm',
];

// 视频格式 - 支持预览
export const VIDEO_PREVIEW_TYPE = ['mp4', 'mkv', 'm4v', 'mov', 'ogg', 'webm'];

// 通用允许上传视频格式
export const TENCENT_VIDEO_TYPE = '.mp4,.mkv,.asf,.avi,.flv,.f4v,.m4v,.mov,.mpg,.mpeg,.mts,.ogg,.vob,.wmv,.webm';
// 允许上传可预览视频格式
export const TENCENT_PREVIEW_VIDEO_TYPE = '.mp4,.mkv,.m4v,.mov,.ogg,.webm';

// 上传图片类型
export const TENCENT_PICTURE_TYPE = '.jpg, .png, .jpeg';

// 上传pdf类型
export const TENCENT_PDF_TYPE = '.pdf';
export const PDF_EXT = ['pdf'];
// 上传doc类型
export const TENCENT_DOC_TYPE = '.doc, .docx';
export const DOC_EXT = ['doc', 'docx'];

// 转码状态
export const TRANSCODE_TYPE = {
  RUNNING: 'Running',
  SUBMITTED: 'Submitted',
  SUCCESS: 'Success',
  FAIL: 'Fail',
};
// 通用图片格式
export const IMG_EXT = ['jpg', 'png', 'jpeg'];
// 图片格式转为通用图片格式可正常展示的图片类型
export const IMG_EXT_CHANGE = ['jpg', 'png', 'jpeg', 'webp', 'gif'];
// 教师学历、身份证资料类型限制
export const PDF_IMG = '.pdf, .jpg, .png, .jpeg';
