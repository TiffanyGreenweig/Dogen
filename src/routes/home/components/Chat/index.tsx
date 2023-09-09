import React, { useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";

import { HOME_NAMESPACE, HOME_TYPE_MODEL } from "@routes/home/models";
import { useStore } from "@models/store";

import './index.less'
import { ROLES_ENUM } from "@constants/common";
import { ChatFrame } from "@components/ChatFrame";
import ChatInput from "@components/ChatInput";

/**
 * todo 聊天增加loading
 * @returns
 */
const Chat = () => {
  const commentRef = useRef<any>()
  const { chatData, modifyChat, updateChat } = useStore<HOME_TYPE_MODEL>(HOME_NAMESPACE);

  const handleSubmit = async (text: string) => {
    commentRef?.current?.updateStatus(true)
    updateChat([...chatData, {
      role: ROLES_ENUM.USER,
      content: text,
    }])
    await modifyChat({
      text,
      history: chatData?.length ? JSON.stringify(chatData) : '',
    })
    commentRef?.current?.updateStatus(false)
  }

  useEffect(() => {
    setTimeout(() => {
      commentRef?.current?.scrollBottom()
    }, 100)
  }, [chatData])

  return (

    <div className='home-chat-wrapper'>
      <ChatFrame comments={chatData} commentRef={commentRef} />
      <ChatInput onSubmit={handleSubmit} />
    </div>
  );
}

export default observer(Chat)
