import React, { useImperativeHandle, useState } from "react";
import classNames from "classnames";

const Container = ({ onShakeEnd, containerRef }: any) => {
  const [shake, setShake] = useState<boolean>(false)
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
    <div className={classNames("container-content2", {
      'run': shake
    })} >
      <div />
    </div>
  </div>
}

export default Container
