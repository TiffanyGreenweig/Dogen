import React, { useEffect, useImperativeHandle, useRef } from "react";
import { observer } from "mobx-react-lite";
import { Form } from "antd";

import { ROLES_ENUM } from "@constants/common";
import { ChatFrame } from "@components/ChatFrame";
import ChatInput from "@components/ChatInput";

import { HOME_NAMESPACE, HOME_TYPE_MODEL } from "@routes/home/models";
import { useStore } from "@models/store";

import './index.less'

/**
 * @returns
 */
const Chat = ({ showDivination, chatRef }: any) => {
  const [chatForm] = Form.useForm()
  const commentRef = useRef<any>()
  const { chatData, filterChatData, modifyChat, updateChat } = useStore<HOME_TYPE_MODEL>(HOME_NAMESPACE);

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
  }, [filterChatData])

  const initChatText = (value: string) => {
    chatForm.setFieldValue('text', value)
  }

  useImperativeHandle(
    chatRef,
    () => {
      return {
        initChatText,
      }
    },
    [chatForm],
  )

  return (

    <div className='home-chat-wrapper'>
      <div className="chat-guess-btn" onClick={showDivination} />
      <ChatFrame comments={filterChatData} commentRef={commentRef} />
      <ChatInput onSubmit={handleSubmit} chatForm={chatForm} />
    </div>
  );
}

export default observer(Chat)
