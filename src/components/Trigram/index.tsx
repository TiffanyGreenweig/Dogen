import React from "react";
import { HEXAGRAM } from "@constants/common";

import './index.less'

export enum TRIGRAM {
  black = 'trigram-item-black',
  white = 'trigram-item-white'
}

interface ITrigram {
  color?: TRIGRAM
  data?: any[]
}
const Trigram = ({ color = TRIGRAM.white, data = [] }: ITrigram) => {
  return <>
    {!!data?.length && data?.map((item: any) => <div
      key={item?.key}
      className={`${HEXAGRAM.YIN === item?.data ? 'trigram-item-yin' : 'trigram-item-yang'} ${color}`}
    />)}
  </>
}

export default Trigram
