import React, { useImperativeHandle, useRef, useState } from "react";
import { useSprings } from "@react-spring/core";
import { animated } from "@react-spring/web";
import { getCoinsRandom, getMinMaxRandom, getSignRandom } from "@utils/common";
import { Button } from "antd";

const COINS_RANDOM = getCoinsRandom({ number: 3, containerWidth: 600, coinWidth: 80 })
const Yang = [7, 9]
// const Yin = [6, 8]
const Coins = ({ coinRef, onSwayEnd }: any) => {
  const [forward, setForward] = useState(false)
  const [reset, setReset] = useState(false)
  const [shakeResult, setShakeResult] = useState<number[]>()
  const coinsList = useRef<number[]>()

  const items = Array.from(new Array(3).keys());

  // coins动画设置
  const [springs, api] = useSprings(items.length, ((i) => {
    console.log('===== forward', forward)
    // x平移距离
    const animateX = getMinMaxRandom(COINS_RANDOM?.[i]?.[0], COINS_RANDOM?.[i]?.[1])
    // y平移距离
    const animateY = getMinMaxRandom(-200, -400)
    return {
      x: forward ? animateX : 0,
      y: forward ? animateY : -20,
      // reset 不旋转
      rotateX: !reset && forward ? 360 * i : 0,
      delay: 100 * i,
      onResolve: () => {
        console.log('==== reset', reset)
        if (forward) {
          // 甩出硬币
          resetCoins()
        } else if (reset) {
          // 收回硬币
          setReset(false)
          // 第一轮结束后自动第二轮
          if (coinsList?.current?.length === 3) {
            startAnimate()
          }
        }
      }
    }
  }), [forward, reset])

  // 甩出coins
  const startAnimate = () => {
    if (!forward && !reset) {
      setForward(true)
    }
  }

  // 获取coin随机数[6/7/8/9]
  const randomShake = () => {
    const len = getSignRandom(3)
    console.log('==== len', len)
    setShakeResult(len)

  }

  // 重置状态
  const resetCoins = () => {
    setReset(true)
    setForward(false)
    // 二轮
    if (coinsList?.current?.length === 3) {
      const list: any = coinsList?.current?.concat(shakeResult || [])
      coinsList.current = list
      onSwayEnd?.(list)
      setShakeResult([])
    } else {
      // 一轮
      coinsList.current = shakeResult || []
    }
  }

  // 获取coins状态
  const getCoinsStatus = () => {

  }

  useImperativeHandle(
    coinRef,
    () => {
      return {
        startAnimate,
        randomShake,
        resetCoins,
      }
    },
    [],
  )
  return <div className="coins-wrapper">
    <Button onClick={startAnimate}>start</Button>
    {springs.map((props, i) => (
      <animated.div
        key={i}
        style={{
          position: 'absolute',
          width: 80,
          height: 80,
          background: Yang?.includes(shakeResult?.[i] || 0) ? '#000' : '#ccc',
          borderRadius: 40,
          zIndex: i + 2,
          ...props,
        }}
      />
    ))}
  </div>
}

export default Coins
