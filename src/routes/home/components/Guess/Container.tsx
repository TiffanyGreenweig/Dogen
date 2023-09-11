import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import classNames from "classnames";
import BackVideo from "./BackVideo";

const Container = ({ onShakeEnd, containerRef }: any) => {
  const [shake, setShake] = useState<boolean>(false)
  const videoPlayerRef = useRef<any>()
  const onShake = () => {
    setShake(status => !status)
    if (!shake) {
      setTimeout(() => {
        setShake(false)
        onShakeEnd?.()
      }, 1800)
    }
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
    {/* {count === 0 ? <div style={{
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
    />} */}
    <div className={classNames("container-content2", {
      'run': shake
    })} >
      <div />
    </div>
    {/* <BackVideo videoPlayerRef={videoPlayerRef} /> */}
  </div>
}

export default Container
