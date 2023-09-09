import React, { useImperativeHandle, useRef, useState } from "react";

import copy from 'copy-to-clipboard'; import Container from "./Container";
import Coins from "./Coins";
import { HEXAGRAM } from "@constants/common";

import './index.less'
import { useStore } from "@models/store";
import { HOME_NAMESPACE, HOME_TYPE_MODEL } from "@routes/home/models";
import { message } from "antd";
import { observer } from "mobx-react-lite";

const Guess = ({ guessRef, guessEnd }: any) => {
  const [messageApi, contextHolder] = message.useMessage();
  const { divination, getDivination } = useStore<HOME_TYPE_MODEL>(HOME_NAMESPACE);
  const [btn, setBtn] = useState(true)
  const coinRef = useRef<any>()
  const containerRef = useRef<any>()
  const [result, setResult] = useState<any[]>([])
  const [show, setShow] = useState<boolean>(true)

  console.log('divination', divination)
  const showGuess = () => {
    setShow(true)
  }

  const hideGuess = () => {
    setShow(false)
    setResult([])
  }


  const getDivinationFn = async (_result: any[]) => {
    const _divination = await getDivination({
      text: _result?.map(item => item?.data)?.join('')
    })
    copy(_divination)
    messageApi.open({
      icon: <></>,
      content: '已将卦象复制到剪贴板',
      // className: 'custom-class',
    });
    guessEnd?.(_divination)
    hideGuess()
  }

  // 每轮硬币甩出并收回后返回结果
  const coinSwayEnd = (res?: any) => {
    // res 相加
    const data = eval(res?.join?.("+")) % 2;
    const _result: any[] = [{ data, key: `res_${result?.length}` }, ...result]
    setResult(_result)
    if (_result?.length < 6) {
      containerRef?.current?.onShake()
      coinRef?.current?.randomShake?.()
    } else {
      getDivinationFn(_result)
    }
  }

  // 容器晃动结束
  const containerShakeEnd = () => {
    coinRef?.current?.startAnimate?.()
  }

  const startDogen = () => {
    containerRef?.current?.onShake()
    coinRef?.current?.randomShake?.()
  }

  useImperativeHandle(
    guessRef,
    () => {
      return {
        startDogen, showGuess, hideGuess
      }
    },
    [],
  )

  if (!show) return <></>

  // 点击进行卜卦
  return (
    <div className="guess-mask-wrapper">
      {contextHolder}
      {btn && <div className="guess-btn-mask">
        <div onClick={() => {
          setBtn(false)
          startDogen()
        }}>卜一卦</div>
        <div onClick={() => {
          hideGuess()
        }}>放弃</div>
      </div>}
      <div className="guess-result">
        <div className="guess-result-bg" />
        {!divination && !!result?.length && result?.map(item => <div key={item?.key} className={HEXAGRAM.YIN === item?.data ? 'guess-result-item-yin' : 'guess-result-item-yang'} />)}
        {divination && <div>{divination}</div>}
      </div>

      <div className="guess-wrapper">
        <Coins coinRef={coinRef} onSwayEnd={coinSwayEnd} />
        <Container
          containerRef={containerRef}
          onShakeEnd={containerShakeEnd}
        />
      </div>
    </div>
  )
}

export default observer(Guess)
