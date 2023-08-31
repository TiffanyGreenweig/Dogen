if (process.env.NODE_ENV === 'production') {
  // config webpack.publicUrl in runtime,must use free-variables
  // @ts-ignore
  // eslint-disable-next-line
  __webpack_public_path__ = process.env.PKM_CDN_PATH + '/';
}

export {};
