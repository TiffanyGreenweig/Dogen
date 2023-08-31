import { message } from 'antd';
import NP from 'number-precision';



export const APP_CLIENT_ID = 'sso-client-id';

export function stringifyQuery(obj: any, separator = '&', prefix: string) {
  const result = Object.keys(obj || {})
    .sort()
    .reduce(function (item, key) {
      let ret = item;
      let val = obj[key];

      if (Array.isArray(val)) {
        val = val.join(',');
      } else if (val === undefined || val === null) {
        return ret;
      }

      if (ret) {
        ret += separator;
      }
      ret += `${key}=${encodeURIComponent(val)}`;

      return ret;
    }, '');

  if (result && prefix) {
    return prefix + result;
  }
  return result;
}

export function parseQueryString(str: string, sep = '&', eq = '=') {
  if (!str) {
    return {};
  }

  return str.split(sep).reduce((ret, pair) => {
    const exp = new RegExp(`(^.[^${eq}]*)${eq}(.*)`);
    const match = exp.exec(pair);
    if (match) {
      // @ts-ignore
      ret[match[1]] = decodeURIComponent(match[2]);
    }
    return ret;
  }, {});
}

interface TPathObjAndKeys {
  pathKeys: string[];
  pathObj: Record<string, string>;
}

export function generatePathObjAndKeys(sidebarMenusData: any): TPathObjAndKeys {
  const result: TPathObjAndKeys = {
    pathKeys: [],
    pathObj: {},
  };
  sidebarMenusData.forEach((item: any) => {
    result.pathKeys.push(item.action);
    result.pathObj[item.action] = item.title;
    if (item.children?.length) {
      const childrenRes = generatePathObjAndKeys(item.children);
      result.pathKeys.push(...childrenRes.pathKeys);
      result.pathObj = {
        ...result.pathObj,
        ...childrenRes.pathObj,
      };
    }
  });
  return result;
}

// 锚点跳转
export const anchorJump = (anchor?: string) => {
  if (anchor) {
    document?.querySelector(anchor)?.scrollIntoView({ block: 'center' });
  }
};

/**
 * 下载文件
 * @param url
 * @param fileName
 * @param options
 */
export const downloadFile = async (url: string, fileName: string, options?: { downloadType: 'request' | 'normal' }) => {
  try {
    const { downloadType = 'normal' } = options || {};
    const link = document.createElement('a');

    if (downloadType === 'request') {
      const data: any = await fetch(url);
      const blob = await data?.blob();
      link.href = URL.createObjectURL(new Blob([blob]));
    } else {
      link.href = url;
    }
    link.style.display = 'none';
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(link.href);
    document.body.removeChild(link);
  } catch (e: any) {
    e?.message && message.error(e?.message);
  }
};

//  用户是否有效输入
export const isValidInput = (data: any) => {
  for (const key in data) {
    if (
      Object.prototype.hasOwnProperty.call(data, key) &&
      data?.[key] &&
      ((Array.isArray(data?.[key]) && data?.[key]?.length) || !Array.isArray(data[key]))
    ) {
      return true;
    }
  }
  return false;
};




// 添加a标签跳转
export const aJump = (url: string, targetValue = '_blank') => {
  let linkTo = document.createElement('a'); //创建a标签
  linkTo.setAttribute('href', url);
  linkTo.setAttribute('target', targetValue);
  document.body.appendChild(linkTo);
  linkTo.click(); //执行当前对象
  document?.body?.removeChild?.(linkTo);
};

/**
 * 解决穿透问题
 * @param bodyCls
 * @returns {{afterOpen: afterOpen, beforeClose: beforeClose}}
 */
export const pointerEvents = function (bodyCls = 'pointer-open'): any {
  let scrollTop: any;
  // 兼容android获取不到 scrollingElement
  // todo 该log提测后需注释，否则可能会影响到视频预览部分
  // Logger.log('document.scrollingElement', document.scrollingElement);
  if (document.scrollingElement) {
    scrollTop = document.scrollingElement.scrollTop;
  } else {
    scrollTop = Math.max(window?.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop);
  }

  return {
    open(): void {
      document.body.classList.add(bodyCls);
      document.body.style.top = `${-scrollTop}px`;
    },
    close(): void {
      const bodyOffsetTop = document.body.style.top;
      document.body.classList.remove(bodyCls);
      // scrollTop lost after set position:fixed, restore it back.
      // eslint-disable-next-line radix
      (document.scrollingElement || document.documentElement).scrollTop = Math.abs(parseInt(bodyOffsetTop));
    },
  };
};

// 金钱处理 - 除以100且保留2位小数
export const priceDivide100 = (price: number | undefined) => (price ? NP.divide(price || 0, 100).toFixed(2) : '0.00');

export const scrollToId = (anchor: string, position?: 'start') => {
  const elem = document?.getElementById?.(anchor);
  elem?.scrollIntoView({
    behavior: 'smooth',
    block: position,
  });
};

export const handleVideoLength = (videoUrl: string) => {
  return new Promise((resolve: (length: number) => any, reject: (err?: any) => any) => {
    if (!videoUrl) resolve(0);
    try {
      let audio: HTMLAudioElement | null = new Audio(videoUrl);
      // 元数据已加载
      audio?.addEventListener?.('loadedmetadata', () => {
        let duration = audio?.duration || 0;
        resolve(duration);
        audio?.removeEventListener?.('loadedmetadata', () => {});
        audio = null;
      });
    } catch (err) {
      reject(err);
    }
  });
};

// 获取url name
export const getUlrName = (url: string) => {
  if (!url) return '';
  const arr = url?.split('/');
  return arr?.[arr?.length - 1] || '';
};
export const noop = () => {};

export function on<T extends Window | Document | HTMLElement | EventTarget>(
  obj: T | null,
  ...args: Parameters<T['addEventListener']> | [string, Function | null, ...any]
): void {
  if (obj && obj.addEventListener) {
    obj.addEventListener(...(args as Parameters<HTMLElement['addEventListener']>));
  }
}

export function off<T extends Window | Document | HTMLElement | EventTarget>(
  obj: T | null,
  ...args: Parameters<T['removeEventListener']> | [string, Function | null, ...any]
): void {
  if (obj && obj.removeEventListener) {
    obj.removeEventListener(...(args as Parameters<HTMLElement['removeEventListener']>));
  }
}

export const isBrowser = typeof window !== 'undefined';

export const isNavigator = typeof navigator !== 'undefined';

