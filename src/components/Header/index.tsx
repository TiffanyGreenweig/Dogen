import { FC, PropsWithChildren } from 'react';
import { observer } from 'mobx-react-lite';

import './index.less';

/**
 * 用户头部导航栏
 */
const Header: FC<PropsWithChildren<any>> = ({ children }) => {
  //展示常规Header
  return (
    <>
      <div className="header-wrapper" id="header-wrapper">
        <div className="header-logo">
          {/* <img alt="logo" src={LOGO} /> */}
        </div>
      </div>
      {children}
    </>
  );
};

// 导出
export default observer(Header);
