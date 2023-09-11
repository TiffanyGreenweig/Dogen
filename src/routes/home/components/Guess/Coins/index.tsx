import React, { useImperativeHandle, useState } from "react";
import { useSprings } from "@react-spring/core";
import { animated } from "@react-spring/web";
import { getCoinsRandom, getMinMaxRandom, getSignRandom } from "@utils/common";
// import { Button } from "antd";

import './index.less'

import classNames from "classnames";
import { COIN_TYPE } from "@constants/common";

const COINS_RANDOM = getCoinsRandom({ number: 3, containerWidth: 600, coinWidth: 80 })

const STOP_TIME = 1000
const COUNT = 3
const Coins = ({ coinRef, onSwayEnd }: any) => {
  const [forward, setForward] = useState(false)
  const [shakeResult, setShakeResult] = useState<number[]>()

  const items = Array.from(new Array(COUNT).keys());

  // coins动画设置
  const [springs, api] = useSprings(items?.length, ((i) => {
    // x平移距离
    const animateX = getMinMaxRandom(COINS_RANDOM?.[i]?.[0], COINS_RANDOM?.[i]?.[1])
    // y平移距离
    const animateY = getMinMaxRandom(-200, -400)
    return {
      x: forward ? animateX : 0,
      y: forward ? animateY : -20,
      // reset 不旋转
      rotateX: forward ? 360 * (i + 2) : 0,
      delay: forward ? 100 * i : 0,
      onResolve: () => {
        if (i != COUNT - 1) return
        if (forward) {
          setTimeout(() => {
            // 收回硬币
            resetCoins()
          }, STOP_TIME)
        } else {
          // 结束后抛回结果
          shakeResult && onSwayEnd?.(shakeResult)
        }
      }
    }
  }), [forward])

  // 甩出coins
  const startAnimate = () => {
    if (!forward) {
      setForward(true)
    }
  }

  // 获取coin随机数[2/3]
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
        className={classNames('coins-item', {
          'coin-head': COIN_TYPE.HEAD === shakeResult?.[i],
          'coin-tail': COIN_TYPE.TAIL === shakeResult?.[i]
        })}
        style={{
          position: 'absolute',
          zIndex: i + 2,
          ...props,
        }}
      />
    ))}
  </div>
}

export default Coins
