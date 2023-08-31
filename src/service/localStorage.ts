export const getItem = async function (key: string): Promise<string | null> {
  return Promise.resolve(window.localStorage.getItem(key));
};

export const setItem = async function (key: string, value: string): Promise<any> {
  return new Promise(resolve => {
    window.localStorage.setItem(key, value);
    resolve(void 0);
  });
};

export const removeItem = async function (key: string): Promise<any> {
  return new Promise(resolve => {
    window.localStorage.removeItem(key);
    resolve(void 0);
  });
};

export const clear = async function (): Promise<any> {
  return new Promise(resolve => {
    window.localStorage.clear();
    resolve(void 0);
  });
};
