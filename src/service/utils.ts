import { compile, match } from 'path-to-regexp';

export const compileUrl = (apiPath: string, params: any) => {
  const url = compile(apiPath, {
    encode: (value: string) => {
      return encodeURIComponent(value);
    },
  })(params);
  return url;
};

export const createUUID = (): string => {
  /* jshint ignore:start */
  let d = new Date().getTime();
  let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x7) | 0x8).toString(16);
  });
  return uuid;
  /* jshint ignore:end */
};

let DEVICE_ID: string | null = null;

export const getDeviceId = () => {
  if (!DEVICE_ID) {
    DEVICE_ID = localStorage.getItem('DEVICE_ID');
  }
  if (!DEVICE_ID) {
    DEVICE_ID = createUUID();
    localStorage.setItem('DEVICE_ID', DEVICE_ID);
  }
  return DEVICE_ID;
};

export const getRequestParams = (apiPath: string, url: string, params?: any) => {
  const matchResult = match(apiPath)(url);
  const apiParams =
    matchResult && params && !Array.isArray(params)
      ? Object.keys(params).reduce((values, key) => {
          // @ts-ignore
          return { ...values, ...(matchResult.params[key] ? {} : { [key]: params[key] }) };
        }, {})
      : params;
  return apiParams;
};
