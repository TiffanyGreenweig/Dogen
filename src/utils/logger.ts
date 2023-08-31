/**
 * 全局的日志输出
 * @param args
 */
export function log(...args: any): void {
  isDebug() && console.log(...args);
}

/**
 * 全局的日志输出
 * @param args
 */
export function info(...args: any): void {
  isDebug() && console.log(...args);
}

/**
 * 警告日志
 * @param args
 */
export function warn(...args: any): void {
  isDebug() && console.warn(...args);
}

/**
 * 异常日志
 * @param args
 */
export function error(...args: any): void {
  isDebug() && console.error(...args);
}

export function color(...args: any): void {
  isDebug() && console.log('%c【PERFORMANCE】', 'color:#ff6d00;font-size:11px;', ...args);
}

/**
 * 是否开启日志模式并开发环境
 */
export function isDebug(): boolean {
  // return process.env.GROOT_ENV !== 'online' && localStorage.getItem('AI_APP_LOGGER') === 'true';
  return process.env.GROOT_ENV !== 'online';
}

const Logger = {
  info,
  warn,
  error,
  color,
  isDebug,
  log,
};

export default Logger;
