function lazy(cb) {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(function () {
      cb?.();
    });
  } else {
    setTimeout(function () {
      cb?.();
    }, 1500); // 延迟 500 毫秒
  }
}

export const loadFacebook = () => {
  lazy(() => {
    (function (d) {
      var h = d.getElementsByTagName('head')[0];
      var c = d.createElement('script');
      c.defer = true;
      c.type = 'text/javascript';
      c.charset = 'utf-8';
      c.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0';
      h.appendChild(c);
    })(document);
  });
  window.fbAsyncInit = function () {
    window.FB.init({ appId: process.env.REACT_APP_FACEBOOK_APPID, version: 'v3.0' });
  };
};

let loaded = false;
export const loadTCaptcha = () => {
  if (!loaded) {
    // 图形验证码 <script src="https://turing.captcha.qcloud.com/TCaptcha.js" defer>
    lazy(() => {
      loaded = true;
      (function (d) {
        var h = d.getElementsByTagName('head')[0];
        var c = d.createElement('script');
        c.async = true;
        c.type = 'text/javascript';
        c.charset = 'utf-8';
        c.src = 'https://turing.captcha.qcloud.com/TCaptcha.js';
        h.appendChild(c);
      })(document);
    });
  }
};
