import axios, { AxiosRequestConfig, Method } from 'axios';
import { compileUrl, getRequestParams } from './utils';

const request = axios.create({
  headers: {
    'user-token': localStorage.getItem('userToken') ?? '',
    timezone: localStorage.getItem('timezone') ?? '',
    pub_lang: localStorage.getItem('language') ?? '',
    "Content-Type": "json"
  },
});

request.interceptors.request.use(async (config: any): Promise<any> => {
  const headers = config.headers ?? {};

  config.headers = headers;

  const params = config.params ?? {};

  params['_v'] = Date.now();

  return config;
});

const REQUEST = <Req, Res>(method: Method, apiPath: string, options?: any) => {
  return async (params?: Req): Promise<Res> => {

    const baseURL = process.env.REACT_APP_BASE_API_URL;

    const url = compileUrl(apiPath, params);

    const config: AxiosRequestConfig = {
      method,
      baseURL: baseURL,
      url,
      timeout: 20000,
    };

    const apiParams = getRequestParams(apiPath, url, params);

    if (options?.needQuery || method === 'GET') {
      config.params = apiParams;
    } else {
      config.data = apiParams;
    }

    if (options?.responseType) {
      config.responseType = options?.responseType;
    }

    const requestResult = await request(config)
    return requestResult.data;
  };
};

export default REQUEST;
