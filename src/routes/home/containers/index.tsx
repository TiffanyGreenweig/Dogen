import { TAB_ENUM, TAB_MENU } from '@constants/common';
import React, { useRef, useState } from 'react';
import Chat from '../components/Chat';
import Guess from '../components/Guess';
import NameChat from '../components/NameChat';
import './index.less';

/**
 * 首页
 * @returns
 */
const Home = () => {
  const guessRef = useRef<any>()
  const [resultRecord, setResultRecord] = useState<any>()
  const [activeTab, setActiveTab] = useState(TAB_ENUM.GUESS)
  const onGuessEnd = (result: any) => {
    console.log('==== result', result)
    setResultRecord(result)
    // guessRef?.current?.hideGuess?.()
  }
  return (
    <div className="home-wrapper">
      <div className="home-banner">welcome</div>
      <div className='home-tab-wrapper'>
        {TAB_MENU?.map(item => <div key={item?.key} className={item?.key === activeTab ? 'active' : ''} onClick={() => setActiveTab(item?.key)}>{item?.title}</div>)}
      </div>
      {activeTab === TAB_ENUM.GUESS ? <Chat showDivination={() => {
        guessRef?.current?.showGuess?.()
      }} /> : <NameChat />}

      <Guess guessRef={guessRef} guessEnd={onGuessEnd} />
      <div className='home-guess-record'>
        {
          resultRecord
        }
      </div>
    </div >
  );
};

export default Home;
