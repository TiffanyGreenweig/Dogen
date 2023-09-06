import React, { useRef, useState } from "react";
import { observer } from "mobx-react-lite";

import { HOME_NAMESPACE, HOME_TYPE_MODEL } from "@routes/home/models";
import { useStore } from "@models/store";

import { CommentList } from "./CommentList";
import Editor from "./Editor";

import './index.less'
import { CHAT_STORAGE, ROLES_ENUM } from "@constants/common";

/**
 * todo 聊天增加loading
 * @returns
 */
const Chat = () => {

  const commentRef = useRef<any>()
  const { chatData, modifyChat } = useStore<HOME_TYPE_MODEL>(HOME_NAMESPACE);
  const [chatCurrent, setChatCurrent] = useState<any[]>([])

  const handleSubmit = (text: string) => {
    commentRef?.current?.updateStatus(true)
    setChatCurrent([...chatData, {
      role: ROLES_ENUM.USER,
      content: text,
    }])
    setTimeout(() => {
      commentRef?.current?.scrollBottom()
    }, 100)
    const history = sessionStorage.getItem(CHAT_STORAGE) || ''
    modifyChat({
      text,
      history,
    }).then((data) => {
      console.log('====== data', data)
      data && sessionStorage.setItem(CHAT_STORAGE, JSON.stringify(data))
      setChatCurrent(data)
      setTimeout(() => {
        commentRef?.current?.scrollBottom()
      }, 100)
      commentRef?.current?.updateStatus(false)
    }).catch(err => {
      commentRef?.current?.updateStatus(false)
    })
  }

  return (
    <div className="chat-wrapper">
      <CommentList comments={chatCurrent} commentRef={commentRef} />
      <Editor onSubmit={handleSubmit} />
    </div>
  );
}

export default observer(Chat)
