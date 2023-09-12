import { ChatFrame } from "@components/ChatFrame";
import ChatInput from "@components/ChatInput";
import { ROLES_ENUM } from "@constants/common";
import { useStore } from "@models/store";
import { observer } from "mobx-react-lite";
import React, { useEffect, useRef } from "react";
import { NAME_NAMESPACE, NAME_TYPE_MODEL } from "../../models/name";

import './index.less'

/**
 * TODO 连发信息会有问题
 * @returns
 */
const Name = () => {
  const commentRef = useRef<any>()
  const { chatData, filterChatData, modifyChat, updateChat } = useStore<NAME_TYPE_MODEL>(NAME_NAMESPACE);
  // const [chatCurrent, setChatCurrent] = useState<any[]>([])

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

  return (
    <div className="name-wrapper">
      <div className='name-chat-wrapper'>
        <ChatFrame comments={filterChatData} defaultMsg="您好，我是你的起名小助手，请问你想对什么事物起名呢？" commentRef={commentRef} />
        <ChatInput onSubmit={handleSubmit} />
      </div>
    </div >
  )
}

export default observer(Name)
