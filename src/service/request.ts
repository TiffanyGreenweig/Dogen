import axios, { AxiosRequestConfig, Method, ResponseType } from 'axios';
import { getItem } from './localStorage';
import { compileUrl, getRequestParams } from './utils';
import { getDeviceId } from '@allschool/tracker';
import { captureException, withScope } from '@sentry/react';
import { LOCAL_STORAGE } from '@constants/storage';
import { ENGLISH } from '@constants/locale';
import { BASENAME, NO_NEED_CHECK_ENTRY_LIST_ROUTE } from '@constants/common';
import { getCAInfo } from '@utils/common';
import { matchPath } from 'react-router';

class ServiceError extends Error {
  code?: number;
  status?: number;
  cause?: Error;

  constructor(message: string, code?: any) {
    super();
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error().stack;
    }
    this.message = message;
    code && (this.code = code);
    this.name = 'ServiceError';
    code && (this.code = code);
  }
}
const MAX_RETRIES = 3; // 最大重试次数
const RETRY_DELAY = 1000; // 重试延迟时间，单位为毫秒
const DOMAIN_LIST = process.env.REACT_APP_API_SERVER_TEACH_SPARE?.split(',') || [process.env.REACT_APP_BASE_API_URL]; // 域名列表

const axiosInstance = axios.create({
  retry: true,
  retryCount: 0,
  maxRetries: MAX_RETRIES,
  retryDelay: RETRY_DELAY,
} as any);

// @ts-ignore
axiosInstance.interceptors.request.use(async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
  if (config.params) {
    config.params['_v'] = Date.now();
  }

  return config;
});

axiosInstance.interceptors.response.use(
  value => {
    if (value.data.success) {
      return value;
    }
    const { message, code } = value.data;
    throw new ServiceError(message, code);
  },
  error => {
    if (error?.response?.status === 401) {
      localStorage.removeItem(LOCAL_STORAGE.USER_TOKEN);
      localStorage.removeItem(LOCAL_STORAGE.ACCESS_USER_ID);

      if (!NO_NEED_CHECK_ENTRY_LIST_ROUTE.find(path => matchPath(path, location?.pathname?.replace('/teach', '')))) {
        const url = window.location.href;
        const regex = /\/teach(.*)/;
        const match = url.match(regex);
        let query = '/';
        if (match) {
          query = match[1].replace(/^\?/, '');
        }

        location.href = `${BASENAME}/login?callback=${encodeURIComponent(query || '/')}`;
      }
    }

    error.code = error?.response?.data?.code;
    error.message = error?.response?.data?.message || '未知网络异常';
    const { config, request } = error;
    const { retry, retryCount = 0, maxRetries, retryDelay } = config || {};

    if (!retry) {
      return Promise.reject(error);
    }

    // 达到最大重试次数或状态码非0或504时，上报异常并返回错误
    if (retryCount >= maxRetries || (request.status !== 0 && request.status !== 504 && request.status !== 502)) {
      // 401不上报sentry
      request.status !== 401 && reportError(error);
      return Promise.reject(error);
    }

    // 重试策略 只针对 0 跨域 504 服务器超时这种情况
    const { baseURL } = config;
    const currentDomain = baseURL.match(/^https?:\/\/[\w.-]+(:\d+)?(\/api)?/)[0];
    const domainIndex = DOMAIN_LIST.indexOf(currentDomain);
    if (domainIndex === DOMAIN_LIST.length - 1) {
      // throw new Error(`Failed to fetch data from ${url} after trying all domains`);
    }
    const newDomain = DOMAIN_LIST[domainIndex + 1] || DOMAIN_LIST[DOMAIN_LIST?.length - 1];
    const newUrl = baseURL.replace(currentDomain, newDomain);
    // console.log(
    //   `=> CurrentDomain ${currentDomain + url}. Retrying request to ${newUrl}. ${
    //     maxRetries - retryCount
    //   } retries left.`,
    // );
    config.baseURL = newUrl;
    config.retryCount = retryCount + 1;
    reportError(error);
    return new Promise(resolve => setTimeout(resolve, retryDelay)).then(() => axiosInstance(config));
  },
);

// 上报异常
function reportError(error: any) {
  withScope(scope => {
    const { response, config } = error;
    const { headers, baseURL, url, method } = config;
    const { data } = response || {};
    const { message, code } = data || {};
    scope?.setContext('network', {
      headers: JSON.stringify(headers),
      url: baseURL + url,
      method,
      query: config.params,
      body: config.data,
      response: JSON.stringify(data),
    });
    scope?.setTag('c_http_url', baseURL + url);
    scope?.setTag('c_http_method', method);
    scope?.setTag('c_http_status', response?.status);
    scope?.setTag('c_http_retry', config.retryCount);
    scope?.setLevel('debug');

    captureException(new ServiceError(config.retryCount > 0 ? '接口重试' : message, code));
  });
}

const DEFAULT_ENV_VALUE = '0';
interface RequestOptions {
  micro?: string;
  needQuery?: boolean;
  responseType?: ResponseType;
}

// 返回环境配置信息
const getEnvMap = (): Record<string, string> => {
  return {
    [process.env.REACT_APP_API_SERVER_TEACH_PREFIX ||
    DEFAULT_ENV_VALUE]: `${process.env.REACT_APP_API_SERVER_TEACH}/teach`,
    [process.env.REACT_APP_API_SERVER_PARENT_PREFIX ||
    DEFAULT_ENV_VALUE]: `${process.env.REACT_APP_API_SERVER_TEACH}/parent`,
    [process.env.REACT_APP_API_SERVER_MC_PREFIX || DEFAULT_ENV_VALUE]: `${process.env.REACT_APP_API_SERVER_TEACH}/mc`,
  };
};

// 设置请求header
const setHeaders = async (): Promise<Record<string, any>> => {
  return {
    'device-id': getDeviceId(),
    'user-token': (await getItem(LOCAL_STORAGE.USER_TOKEN)) ?? undefined,
    // eg: Asia/Shanghai
    timezone: localStorage.getItem(LOCAL_STORAGE.TIMEZONE) ?? '',
    pub_lang: ENGLISH,
    'ca-info': getCAInfo(),
    'huohua-podenv':
      (process.env.GROOT_ENV === 'dev' || process.env.GROOT_ENV === 'qa') && (await window.HuoHuaEnvTool?.getEnv()),
  };
};

// 设置参数
const setRequestParams = (
  apiPath: string,
  params: any = {},
  method: Method,
  needQuery?: boolean,
): Record<string, any> => {
  const apiParams = getRequestParams(apiPath, compileUrl(apiPath, params), params);

  return needQuery || method === 'GET' ? { params: apiParams } : { data: apiParams };
};

// 默认超时时间
const DEFAULT_TIMEOUT = 20000;

const REQUEST = <Req, Res>(method: Method, apiPath: string, options?: RequestOptions) => {
  return async (params?: Req): Promise<Res> => {
    const envMap = getEnvMap();

    if (Object.keys(envMap).includes('0')) {
      throw new Error('环境变量配置异常, 缺少必要配置');
    }

    const baseURL = envMap[options?.micro || DEFAULT_ENV_VALUE] || options?.micro;

    const headers = await setHeaders();

    const paramsConfig = setRequestParams(apiPath, params, method, options?.needQuery);

    const config: AxiosRequestConfig = {
      method,
      baseURL,
      url: compileUrl(apiPath, params),
      headers,
      timeout: DEFAULT_TIMEOUT,
      ...paramsConfig,
      ...(options?.responseType && { responseType: options.responseType }),
    };

    return (await axiosInstance(config))?.data?.data;
  };
};

export default REQUEST;
