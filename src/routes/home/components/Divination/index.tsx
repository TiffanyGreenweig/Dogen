import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";

import Chat from '../Chat';
import Guess from '../Guess';
import Trigram, { TRIGRAM } from '@components/Trigram';

import { downloadFile } from '@utils/common';
import { useStore } from "@models/store";
import { HOME_NAMESPACE, HOME_TYPE_MODEL } from "@routes/home/models";

import './index.less'


const Divination = () => {
  const guessRef = useRef<any>()
  const [resultRecord, setResultRecord] = useState<any>()
  const divinationRef = useRef<any>()
  const { genImg, divinationFlag } = useStore<HOME_TYPE_MODEL>(HOME_NAMESPACE);

  useEffect(() => {
    if (divinationFlag) guessRef?.current?.showGuess?.()
  }, [divinationFlag])


  const onGuessEnd = ({ divination, result }: any) => {
    console.log('==== result', result)
    setResultRecord({ divination, result })
    // guessRef?.current?.hideGuess?.()
    divinationRef?.current?.initChatText(divination)
  }
  return <div className="divination-wrapper">
    <Chat chatRef={divinationRef} showDivination={() => {
      guessRef?.current?.showGuess?.()
    }} />
    <Guess guessRef={guessRef} guessEnd={onGuessEnd} />

    <div className="divination-tip">
      卜卦并非迷信，其目的在于人生处于迷茫，选择，举棋不定之时，通过卜卦，给予自己一个提示，理顺自己的思路，从当中找到那种迂回的，能趋吉避凶，能把损害减到最小的方式去做。如果你对于一个事情无论占卜的结果吉凶与否，你都坚持要做，那你就不要占卜，只管去做，否则占卜的结果只会影响你的心境。
    </div>

    {resultRecord && <div className='divination-guess-record'>
      <p>卜卦结果 </p>
      <Trigram color={TRIGRAM.black} data={resultRecord?.result} />
      {
        resultRecord?.divination
      }
      {genImg && <div className='divination-guess-img'>
        <p>根据卦象为您生成的图片</p>
        <div>双击图片下载</div>
        <img onDoubleClick={() => {
          downloadFile(genImg, `${resultRecord?.divination}.jpg` || '图片', {
            downloadType: 'request'
          })
        }} src={genImg} alt="img" />
      </div>}
    </div>}
  </div>
}

export default observer(Divination)
