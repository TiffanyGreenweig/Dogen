/* tslint:disable */
export {};

declare global {
  interface Window {
    Intercom: any;
    matchMedia: any;
    Sentry: any;
    hj: any;
    snapSaveState: any;
    __PRELOADED_STATE__: any;
    __PRELOADED_I18N_STATE__: any;
    fbq: any;
    _fbq: any;
    twq: any;
    gtag: any;
    dataLayer: any;
    _home_login_flag: boolean;
    wx: any;
    nativeGoBack: any;
    nativeReplaceUrl: any;
    smartlook: any;
    // 独立环境工具
    HuoHuaEnvTool?: {
      getEnv: () => Promise<string>;
    };
    canStopXhr: any; // xhr重构
    XMLHttpRequest: any;
    lib: any;
  }

  type ValueOf<T> = T[keyof T];
}
