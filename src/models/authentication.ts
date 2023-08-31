import { flow, types } from 'mobx-state-tree';

import { PostVerifyCodeSign, PostVerifyCodeBind } from '@/service/parent/AuthCodeController';
import { PostCaptchaGen, PostCaptchaVerify } from '@/service/parent/CaptchaController';
import { PostAccountBindExchange, PostAccountExists, PostAccountBind } from '@/service/parent/BindController';

const ignoreEmptySpaces = (str: any) => {
  const reg = /(?:^\s+)|(?:\s+$)/g;
  if (str?.replace && reg.test(str)) {
    return str.replace(reg, '');
  }
  return str;
};

// 导出namespace
export const AUTHENTICATION_NAMESPACE = 'AuthenticationModel';

// 导出ts约束
export type AUTHENTICATION_TYPE_MODEL = typeof AuthenticationModel;

const AuthenticationModel = types
  .model(AUTHENTICATION_NAMESPACE, {
    captcha: types.maybe(types.frozen<PARENT.AuthCodeVo>({})),
    graphicsCaptcha: types.maybe(types.frozen<PARENT.CaptchaVo>()),
  })
  .actions(self => {
    const getCaptcha = flow<PARENT.AuthCodeVo | void, [Omit<PARENT.AuthCodeForm, 'accountType'>]>(function* ({
      account,
      ...payload
    }) {
      const res = yield PostVerifyCodeSign({ ...payload, account: ignoreEmptySpaces(account), accountType: 1 });
      self.captcha = res;
      return res;
    });

    const getGraphicsCaptcha = flow<PARENT.CaptchaVo | void, [PARENT.CaptchaForm | void]>(function* (payload) {
      const res = yield PostCaptchaGen(payload ?? { width: 261, height: 144 });
      self.graphicsCaptcha = res ?? {};
      return res;
    });

    let prevStep: any;
    const verifyGraphicsCaptcha = flow<any, [PARENT.CaptchaVerifyForm]>(function* (payload) {
      try {
        const sessionId = yield PostCaptchaVerify(payload);
        if (sessionId) {
          self.graphicsCaptcha = undefined;
          yield prevStep(sessionId);
        }
      } catch (error: any) {
        getGraphicsCaptcha();
        return Promise.reject(error);
      }
    });

    const checkAccountExists = flow<boolean | undefined, [PARENT.AccountDisplayForm]>(function* ({
      account,
      ...payload
    }) {
      return yield PostAccountExists({ ...payload, account: ignoreEmptySpaces(account) });
    });
    const getCaptchaForBinding = flow<void | PARENT.AuthCodeVo, [PARENT.AuthCodeForm & { validateExists?: boolean }]>(
      function* ({ validateExists, account, ...payload }) {
        if (validateExists) {
          const exists = yield checkAccountExists({ ...payload, account: ignoreEmptySpaces(account) });
          if (!exists) {
            const captcha = yield PostVerifyCodeBind({ ...payload, account: ignoreEmptySpaces(account) });
            self.captcha = captcha ?? {};
            return self.captcha;
          } else {
            if (payload.accountType === 1) {
              const error: any = new Error(
                'The mobile phone number has been registered, please contact customer service',
              );
              error.exists = true;
              throw error;
            }
            if (payload.accountType === 2) {
              const error: any = new Error('The email has been registered, please contact customer service');
              error.exists = true;
              throw error;
            }
          }
        }
        self.captcha = yield PostVerifyCodeBind({ ...payload, account: ignoreEmptySpaces(account) });

        return self.captcha;
      },
    );

    const changeBinding = flow<boolean | undefined, [PostAccountBindExchangeQuery]>(function* ({
      changeAccount,
      ...payload
    }) {
      return yield PostAccountBindExchange({ ...payload, changeAccount: ignoreEmptySpaces(changeAccount) });
    });

    const bind = flow<boolean | undefined, [PARENT.AccountBindForm]>(function* ({ account, ...payload }) {
      return yield PostAccountBind({ ...payload, account: ignoreEmptySpaces(account) });
    });

    const reset = () => {
      self.captcha = undefined;
      self.graphicsCaptcha = undefined;
    };

    return {
      getCaptcha,
      changeBinding,
      getGraphicsCaptcha,
      verifyGraphicsCaptcha,
      getCaptchaForBinding,
      bind,
      reset,
    };
  });

export default AuthenticationModel;
