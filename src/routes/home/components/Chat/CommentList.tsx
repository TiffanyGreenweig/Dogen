import React, { useImperativeHandle, useState } from "react";
import { List, Spin } from "antd";
import classNames from 'classnames'
import moment from "moment";
import { DATA_ENUM, ROLES_ENUM } from "@constants/common";
import { LoadingOutlined } from '@ant-design/icons';

// todo 支持内容html渲染
export const CommentList = ({ comments, commentRef }: { comments: IChatItem[], commentRef?: any }) => {
  const [updateLoading, setUpdateLoading] = useState<boolean>(false)

  const scrollBottom = () => {
    document.querySelector('#scrollSetBar')?.scrollIntoView()
  }

  const updateStatus = (status: boolean) => {
    setUpdateLoading(status)
  }
  useImperativeHandle(
    commentRef,
    () => {
      return {
        scrollBottom,
        updateStatus
      }
    },
    [],
  )

  const ChatItem = ({ props }: { props: IChatItem }) => (<div className={classNames('comment-content-box', {
    'comment-content-author': props?.role === ROLES_ENUM.USER,
  })}>
    <img className="comment-avatar" src={DATA_ENUM[props?.role || 'default']?.avatar} alt="avatar" />
    <div className="comment-content">
      <div className="comment-author">{DATA_ENUM[props?.role || 'default']?.name}<span className="comment-time">{props?.datetime ? moment(props?.datetime).format('MM.DD HH:mm') : ''}</span></div>
      <div className="comment-desc" dangerouslySetInnerHTML={{ __html: props?.content || '' }} />
    </div>
  </div>)

  return (
    <div className="chat-comment-wrapper">
      <div className="chat-comment-content">
        <ChatItem props={{
          content: '您好，请问你有什么困惑呢？',
          role: ROLES_ENUM.ASSISTANT,
        }} />
        <List
          dataSource={comments}
          itemLayout="horizontal"
          renderItem={(props) => <ChatItem props={props} />}
        />
        <div id="scrollSetBar" className="scroll-set-bar">
          {updateLoading && <Spin className="chat-comment-loading" indicator={<LoadingOutlined rev={undefined} spin />} />}
        </div>
      </div>
    </div>
  );
}
