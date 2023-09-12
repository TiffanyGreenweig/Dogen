import React, { useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { useStore } from '@models/store';
import { HOME_NAMESPACE, HOME_TYPE_MODEL } from '../models';

import { TAB_ENUM, TAB_MENU } from '@constants/common';

import NameChat from '../components/NameChat';

import './index.less';
import Divination from '../components/Divination';

/**
 * 首页
 * @returns
 */
const Home = () => {
  const [activeTab, setActiveTab] = useState(TAB_ENUM.GUESS)

  return (
    <div className="home-wrapper">
      <div className='home-tab-wrapper'>
        {TAB_MENU?.map(item => <div key={item?.key} className={item?.key === activeTab ? 'active' : ''} onClick={() => setActiveTab(item?.key)}>{item?.title}</div>)}
      </div>
      <div className='home-content'>
        {activeTab === TAB_ENUM.GUESS ? <Divination /> : <NameChat />}
      </div>

    </div >
  );
};

export default observer(Home);
