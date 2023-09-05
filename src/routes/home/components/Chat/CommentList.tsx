import React, { useImperativeHandle } from "react";
import { List } from "antd";
import classNames from 'classnames'
import moment from "moment";

// todo 支持内容html渲染
export const CommentList = ({ comments, commentRef }: { comments: CommentItem[], commentRef?: any }) => {
  const scrollBottom = () => {
    document.querySelector('#scrollSetBar')?.scrollIntoView()
  }
  useImperativeHandle(
    commentRef,
    () => {
      return {
        scrollBottom
      }
    },
    [],
  )

  return (
    <div className="chat-comment-wrapper">
      <List
        dataSource={comments}
        itemLayout="horizontal"
        renderItem={props => <div className={classNames('comment-content-box', {
          'comment-content-author': props?.type === 1,
        })}>
          <img className="comment-avatar" src="https://hf-sim.allschoolcdn.com/sim/sparkenglish-sv/groot-teaching/teach/useInfo/2023-03-30/d341400c-b87e-470f-9f79-d3826a3fe052.jpeg" alt="avatar"></img>
          <div className="comment-content">
            <div className="comment-author">{props?.author}<span className="comment-time">{moment(props?.datetime).format('MM.DD HH:mm')}</span></div>
            <div className="comment-desc" dangerouslySetInnerHTML={{ __html: props?.content || '' }}></div>
          </div>
        </div>}
      />
      <div id="scrollSetBar" className="scroll-set-bar"></div>
    </div>
  );
}
