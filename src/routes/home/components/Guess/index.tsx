import React, { useCallback, useImperativeHandle, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import Particles from "react-tsparticles";

import Container from "./Container";
import Coins from "./Coins";
import Trigram from "@components/Trigram";

// import useTrail from "@hooks/useTrail";
import useRepulse from "@hooks/useRepulse";
import { useStore } from "@models/store";
import { HOME_NAMESPACE, HOME_TYPE_MODEL } from "@routes/home/models";

import './index.less'

const Guess = ({ guessRef, guessEnd }: any) => {
  const { divination, resetDivinationData, getGenImg, getDivination } = useStore<HOME_TYPE_MODEL>(HOME_NAMESPACE);
  const [btn, setBtn] = useState(true)
  const coinRef = useRef<any>()
  const containerRef = useRef<any>()
  const [result, setResult] = useState<any[]>([])
  const [show, setShow] = useState<boolean>(false)

  const { particlesInit, options } = useRepulse()
  const showGuess = () => {
    setShow(true)
  }

  const hideGuess = () => {
    setShow(false)
    setResult([])
    setBtn(true)
    resetDivinationData()
  }

  const particlesLoaded = useCallback(async (container: any) => {
    await console.log(container);
  }, []);

  const getDivinationFn = async (_result: any[]) => {
    const text = _result?.map(item => item?.data)?.join('')
    getGenImg({
      text,
    })
    const _divination = await getDivination({
      text,
    })
    setTimeout(() => {
      guessEnd?.({ divination: _divination, result: _result })
      hideGuess()
    }, 1000)
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
      <Particles id="tsparticles" init={particlesInit} loaded={particlesLoaded} options={options} />
      {btn && <div className="guess-btn-mask">
        <div onClick={() => {
          setBtn(false)
          setTimeout(() => {
            startDogen()
          }, 1000)
        }}>卜一卦</div>
        <div onClick={() => {
          hideGuess()
        }}>放弃</div>
      </div>}
      {!btn && <>
        <div className="guess-result">
          <div className={`guess-result-bg ${result?.length !== 6 ? 'run' : ''}`} style={{
            opacity: (result?.length - 1) * 0.1 + 0.1
          }} />
          {!divination && <Trigram data={result} />}
          {divination && <div className="guess-result-divination">{divination}</div>}
        </div>

        <div className="guess-wrapper">
          <div className="guess-background" />
          <Coins coinRef={coinRef} onSwayEnd={coinSwayEnd} />
          <Container
            containerRef={containerRef}
            onShakeEnd={containerShakeEnd}
          />
        </div>
      </>}
    </div>
  )
}

export default observer(Guess)
