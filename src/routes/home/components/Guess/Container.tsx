import React, { useState } from "react";
import { animated, useSpring } from "@react-spring/web";

const Container = ({ onShakeEnd, onShake }: any) => {
  const [shake, setShake] = useState<boolean>(false)
  const spring = useSpring({
    x: 0,
    y: shake ? -50 * Math.random() - 5 : 0,
    loop: true,
    config: {
      friction: shake ? 1 : 10,
    },
    duration: 2000,
    onResolve() {
      setShake(false)
      if (shake) {
        onShakeEnd?.()
      }
    },
  })
  return <div className="container-wrapper">
    <animated.div
      onClick={() => {
        if (!shake) onShake?.()
        setShake(status => !status)
      }}
      style={{
        position: 'absolute',
        width: 300,
        height: 150,
        background: 'skyblue',
        borderRadius: 8,
        ...spring,
      }}
    />
  </div>
}

export default Container
