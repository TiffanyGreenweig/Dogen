import React, { useRef, useState } from "react";
import Container from "./Container";
import Coins from "./Coins";
import { Button } from "antd";

import './index.less'

const Guess = () => {
  const coinRef = useRef<any>()
  const containerRef = useRef<any>()
  const [result, setResult] = useState<any[]>([])

  // 每轮硬币甩出并收回后返回结果
  const coinSwayEnd = (res?: any) => {
    // res 相加
    const data = eval(res?.join?.("+"));
    // console.log('======= data', data)
    const _result: any[] = [...result, data]
    setResult(_result)
    if (_result?.length < 6) {
      containerRef?.current?.onShake()
      coinRef?.current?.randomShake?.()
    }
  }

  // 容器晃动结束
  const containerShakeEnd = () => {
    coinRef?.current?.startAnimate?.()
  }

  // 点击进行卜卦

  return (
    <div className="guess-mask-wrapper">
      <div className="guess-wrapper">
        <Coins coinRef={coinRef} onSwayEnd={coinSwayEnd} />
        <Container
          containerRef={containerRef}
          onShakeEnd={containerShakeEnd}
        />
        <Button onClick={() => {
          containerRef?.current?.onShake()
          coinRef?.current?.randomShake?.()
        }}>Start Dogen</Button>
        <div>
          {!!result?.length && result?.map(item => <div>
            {(item % 2) === 0 ? '-' : '--'}
          </div>)}
        </div>
      </div>
    </div>
  )
}

export default Guess
