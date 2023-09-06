import React, { useImperativeHandle, useRef, useState } from "react";
import { useSprings } from "@react-spring/core";
import { animated } from "@react-spring/web";
import { getCoinsRandom, getMinMaxRandom, getSignRandom } from "@utils/common";
// import { Button } from "antd";

const COINS_RANDOM = getCoinsRandom({ number: 3, containerWidth: 600, coinWidth: 80 })
const Yang = [7, 9]
// const Yin = [6, 8]
const STOP_TIME = 1000
const COUNT = 3
const Coins = ({ coinRef, onSwayEnd }: any) => {
  const [forward, setForward] = useState(false)
  const [shakeResult, setShakeResult] = useState<number[]>()
  const countRef = useRef<any>()

  const items = Array.from(new Array(COUNT).keys());

  // coins动画设置
  const [springs, api] = useSprings(items?.length, ((i) => {
    if (!countRef?.current) return {}
    console.log('===== forward', forward)
    // x平移距离
    const animateX = getMinMaxRandom(COINS_RANDOM?.[i]?.[0], COINS_RANDOM?.[i]?.[1])
    // y平移距离
    const animateY = getMinMaxRandom(-200, -400)
    return {
      x: forward ? animateX : 0,
      y: forward ? animateY : -20,
      // reset 不旋转
      rotateX: forward ? 360 * i : 0,
      delay: 100 * i,
      onResolve: () => {
        if (i != COUNT - 1) return
        console.log('===========  Coins onResolve')
        if (forward) {
          setTimeout(() => {
            // 收回硬币
            resetCoins()
          }, STOP_TIME)
        } else {
          onSwayEnd?.(shakeResult)
        }
      }
    }
  }), [forward])

  // 甩出coins
  const startAnimate = () => {
    countRef.current = countRef?.current ? countRef?.current + 1 : 1
    console.log('======= Coins startAnimate')
    if (!forward) {
      setForward(true)
    }
  }

  // 获取coin随机数[6/7/8/9]
  const randomShake = () => {
    const len = getSignRandom(3)
    setShakeResult(len)
  }

  // 收回硬币
  const resetCoins = () => {
    setForward(false)
  }

  useImperativeHandle(
    coinRef,
    () => {
      return {
        startAnimate,
        randomShake,
      }
    },
    [],
  )
  return <div className="coins-wrapper">
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
