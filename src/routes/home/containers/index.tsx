import React, { useRef, useState } from 'react';
import Chat from '../components/Chat';
import Guess from '../components/Guess';
import './index.less';

/**
 * 首页
 * @returns
 */
const Home = () => {
  const guessRef = useRef<any>()
  const [resultRecord, setResultRecord] = useState<any>()
  const onGuessEnd = (result: any) => {
    console.log('==== result', result)
    setResultRecord(result)
    // guessRef?.current?.hideGuess?.()
  }
  return (
    <div className="home-wrapper">
      <div className="home-banner">welcome</div>
      <Chat />
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
