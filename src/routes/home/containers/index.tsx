import React from 'react';
import Chat from '../components/Chat';
import Guess from '../components/Guess';
import './index.less';

/**
 * 首页
 * @returns
 */
const Home = () => {
  console.log('home ---- ')
  return (
    <div className="home-wrapper">
      <div className="home-banner">welcome</div>
      <div className='home-chat-wrapper'>
        <Chat />
      </div>
      <div className='home-dogen-wrapper'>
        <Guess />
      </div>
    </div >
  );
};

export default Home;
