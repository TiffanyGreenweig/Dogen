// xhr中的方法拦截，eg: open、send etc.
function hookFunction(funcName: any, config: any) {
  return function (this: any) {
    const args = Array.prototype.slice.call(arguments);
    // 将open参数存入xhr, 在其它事件回调中可以获取到。
    if (funcName === 'open') {
      this.xhr.open_args = args;
    }
    if (config[funcName]) {
      // 配置的函数执行结果返回为true时终止调用
      const result = config[funcName].call(this, args, this.xhr);
      if (result) return result;
    }
    return this.xhr[funcName].apply(this.xhr, arguments);
  };
}
// xhr中的属性和事件的拦截
function getterFactory(attr: any, config: any) {
  return function (this: any) {
    const value = Object.prototype.hasOwnProperty.call(this, `${attr}_`) ? this[`${attr}_`] : this.xhr[attr];
    const getterHook = (config[attr] || {})['getter'];
    return (getterHook && getterHook(value, this)) || value;
  };
}
// 在赋值时触发该工厂函数（如onload等事件）
function setterFactory(attr: any, config: any) {
  return function (this: any, value: any) {
    const _this = this;
    const xhr = this.xhr;
    const hook = config[attr]; // 方法或对象
    this[`${attr}_`] = value;
    if (/^on/.test(attr)) {
      // note：间接的在真实的xhr上给事件绑定函数
      xhr[attr] = function (e: any) {
        // e = configEvent(e, _this)
        const result = hook && config[attr].call(_this, xhr, e);
        result || value.call(_this, e);
      };
    } else {
      const attrSetterHook = (hook || {})['setter'];
      value = (attrSetterHook && attrSetterHook(value, _this)) || value;
      try {
        // 并非xhr的所有属性都是可写的
        xhr[attr] = value;
      } catch (e) {
        console.warn('xhr的' + attr + '属性不可写');
      }
    }
  };
}
// 核心拦截的handler
export function xhrHook(config: any) {
  // 存储真实的xhr构造器, 在取消hook时，可恢复
  window.canStopXhr = window.canStopXhr || XMLHttpRequest;
  // 重写XMLHttpRequest构造函数
  // @ts-ignore
  // eslint-disable-next-line no-global-assign
  XMLHttpRequest = function (this: any) {
    const xhr = new window.canStopXhr();
    // 真实的xhr实例存储到自定义的xhr属性中
    this.xhr = xhr;
    // note: 遍历实例及其原型上的属性（实例和原型链上有相同属性时，取实例属性）
    for (const attr in xhr) {
      if (Object.prototype.toString.call(xhr[attr]) === '[object Function]') {
        this[attr] = hookFunction(attr, config); // 接管xhr function
      } else {
        // attention: 如果重写XMLHttpRequest，必须要全部重写，否则在ajax中不会触发success、error（原因是3.x版本是在load事件中执行success）
        Object.defineProperty(this, attr, {
          // 接管xhr attr、event
          get: getterFactory(attr, config),
          set: setterFactory(attr, config),
          enumerable: true,
        });
      }
    }
  };
  return window.canStopXhr;
}
// 解除xhr拦截，归还xhr管理权
export function unXhrHook() {
  // eslint-disable-next-line no-global-assign
  if (window?.canStopXhr) XMLHttpRequest = window?.canStopXhr;
  window.canStopXhr = undefined;
}
