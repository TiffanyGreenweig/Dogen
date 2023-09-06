import React, { useImperativeHandle, useState } from "react";
import { animated, useSpring } from "@react-spring/web";
import { getMinMaxRandom } from "@utils/common";

const Container = ({ onShakeEnd, containerRef }: any) => {
  const [count, setCount] = useState(0)
  const [shake, setShake] = useState<boolean>(false)
  const spring = useSpring({
    config: {
      friction: shake ? 5 : 10,
    },
    from: {
      x: 0,
      y: 0,
    },
    to: async (next, cancel) => {
      console.log('====== to shake', shake)
      if (!shake) {
        cancel()
        return
      }
      await next({ y: 10, x: 20, background: '#fff59a' })
      await next({ y: -5, x: -8, background: '#ff6d6d' })
      await next({ y: 0, x: 0, background: '#ff6d6d' })
    },
    onResolve() {
      if (shake) {
        onShakeEnd?.()
        setShake(false)
      }
    },
  })
  const onShake = () => {
    console.log('======= onShake')
    if (!count) setCount(1)
    setShake(status => !status)
  }

  useImperativeHandle(
    containerRef,
    () => {
      return {
        onShake
      }
    },
    [],
  )
  return <div className="container-wrapper">
    {count === 0 ? <div style={{
      position: 'absolute',
      width: 300,
      height: 150,
      background: 'skyblue',
      borderRadius: 8,
    }}></div> : <animated.div
      style={{
        position: 'absolute',
        width: 300,
        height: 150,
        background: 'skyblue',
        borderRadius: 8,
        ...spring,
      }}
    />}
  </div>
}

export default Container
