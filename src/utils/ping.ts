/**
 * Creates a Ping instance.
 * @returns {Ping}
 * @constructor
 */
let instance: any = null;

let Ping = function (this: any, opt: any): any {
  if (instance) {
    return instance;
  }

  this.opt = opt || {};
  this.favicon = this.opt.favicon || '/favicon.ico';
  this.timeout = this.opt.timeout || 0;
  this.logError = this.opt.logError || false;
  initIframe.call(this);
  instance = this;
};

const initIframe = function (this: any) {
  // 初始化空iframe
  this.iframe = document.createElement('iframe');
  this.iframe.style.display = 'none';
  this.iframe.style.weight = '0';
  this.iframe.style.height = '0';
  document.body.appendChild(this.iframe);
};

/**
 * Pings source and triggers a callback when completed.
 * @param source Source of the website or server, including protocol and port.
 * @param callback Callback function to trigger when completed. Returns error and ping value.
 * @param timeout Optional number of milliseconds to wait before aborting.
 */
Ping.prototype.ping = function (source: any, callback: any) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  let self: any = this;
  const url = source + self.favicon;

  self.wasSuccess = false;

  let timeoutTimer: any;
  let start = new Date();
  function onload(e: any) {
    self.wasSuccess = true;
    pingCheck.call(self, e);
  }

  function onerror(e: any) {
    self.wasSuccess = false;

    callback('error', 0);
  }

  /**
   * Times ping and triggers callback.
   */
  function pingCheck(this: any, event: any) {
    if (timeoutTimer) {
      clearTimeout(timeoutTimer);
    }
    // @ts-ignore
    let pong = new Date() - start;

    if (typeof callback === 'function') {
      if (!self.wasSuccess) {
        if (self.logError) {
          console.error('error loading resource');
        }

        return callback('error', pong);
      }
      return callback(null, pong);
    }
  }

  const iframe = this.iframe;

  const doc = iframe.contentWindow.document;

  window.addEventListener('message', function (e) {
    // 只解析allschool.com域名
    if (e.data === 'iframe-ping') {
      const img = doc.getElementsByTagName('img')[0];

      if (img) {
        // 注入 handle
        img.onload = onload;
        img.onerror = onerror;
      }

      clearTimeout(timeoutTimer);

      // abort iframe 内请求
      timeoutTimer = setTimeout(function () {
        iframe.contentWindow?.stop();
        // 销毁
        destroyIframe(iframe);
      }, self.timeout);
    }
  });

  doc.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <script>
            function trigger(){var e=new Image(0,0);e.src="${
              url + '?' + Number(new Date())
            }",document.body.appendChild(e),window.parent.postMessage("iframe-ping","*")}
        </script>
      </head>
      <body onload="trigger()" />
    </html>
  `);

  doc.close(); // iframe onload event happens
};

/**
 * 销毁iframe，释放iframe所占用的内存。

 * @param iframe 须要销毁的iframe对象
 */
function destroyIframe(iframe: any) {
  // 把iframe指向空白页面，这样能够释放大部分内存。
  iframe.src = 'about:blank';
  try {
    iframe.contentWindow.document.write('');
    iframe.contentWindow.document.clear();
    // 把iframe从页面移除
    iframe.parentNode.removeChild(iframe);
  } catch (e) {
    // do somthing
  }
}

// 导出
export default Ping;
