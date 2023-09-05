import React, { useRef, useState } from "react";
import Container from "./Container";
import Coins from "./Coins";

import './index.less'

const Guess = () => {
  const coinRef = useRef<any>()

  return (
    <div className="guess-wrapper">
      <Coins coinRef={coinRef} />
      <Container
        onShakeEnd={() => {
          coinRef?.current?.startAnimate?.()
        }}
        onShake={() => {
          coinRef?.current?.randomShake?.()
        }} />
    </div>
  )
}

export default Guess
