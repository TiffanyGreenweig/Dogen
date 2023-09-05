import React, { useImperativeHandle, useState } from "react";
import { useSprings, useTrail } from "@react-spring/core";
import { a } from "@react-spring/web";
import { getSignRandom } from "@utils/common";
import { Button } from "antd";

const Yang = [7, 9]
// const Yin = [6, 8]
const Coins2 = ({ coinRef }: any) => {
  const [forward, setForward] = useState(false)
  const [shakeResult, setShakeResult] = useState<number[]>()

  const items = Array.from(new Array(3).keys());

  const [trails] = useTrail(items.length, (i) => {
    const _x = 500 * Math.random() + i
    const _y = - 500 * Math.random() + i
    console.log('===== trails', i, _x, _y)
    return {
      config: { mass: 5, tension: 2000, friction: 200 },
      opacity: forward ? 1 : 0,
      x: forward ? _x : 0,
      y: forward ? _y : 0,
      delay: 1000,
    }
  }, [forward])

  console.log('===== trail', trails)

  const bind = () => {
    setForward(status => !status)
  }
  const randomShake = () => {
    const len = getSignRandom(3)
    console.log('==== len', len)
    setShakeResult(len)
  }

  useImperativeHandle(
    coinRef,
    () => {
      return {
        bind,
        randomShake,
      }
    },
    [],
  )
  return <div className="coins-wrapper">
    <Button style={{
      zIndex: 99,
    }} onClick={bind}>start</Button>

    {trails?.map((props, i) => (
      <a.div
        key={`trail_${i}`}
        style={{
          position: 'absolute',
          width: 80,
          height: 80,
          background: Yang?.includes(shakeResult?.[i] || 0) ? '#000' : '#ccc',
          borderRadius: 40,
          ...props,
        }}
      />
    ))}

  </div>
}

export default Coins2
