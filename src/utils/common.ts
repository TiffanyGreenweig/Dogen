import { message } from 'antd';

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


export const getMinMaxRandom = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const getSignRandom = (length: number) => {
  return Array.from(new Array(length).keys()).map(() => getMinMaxRandom(6, 9))
}

// 获取每个coin随机区间
export const getCoinsRandom = ({ number, containerWidth, coinWidth }: {
  number: number; // 几个coin
  containerWidth: number; // 容器宽度
  coinWidth: number; // 硬币宽度
}) => {
  const randomList = Array.from(new Array(number).keys())?.map((index: number) => {
    const minX = index === 0 ? (- containerWidth / 2) : (((- containerWidth / 2) + (containerWidth / number) * index) - coinWidth / 2)

    const maxX = index === number - 1 ? containerWidth / 2 : (((- containerWidth / 2) + (containerWidth / number) * (index + 1)) + coinWidth / 2)

    return [minX, maxX]
  })

  return randomList
}
