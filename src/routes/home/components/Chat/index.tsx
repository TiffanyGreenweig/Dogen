import React, { useRef, useState } from "react";
import { CommentList } from "./CommentList";
import Editor from "./Editor";

import './index.less'

const Chat = () => {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState('');
  const commentRef = useRef<any>()

  const handleSubmit = () => {
    if (!value) return;

    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setValue('');
      setComments([
        ...comments,
        {
          author: 'Han Solo',
          avatar: 'https://joeschmoe.io/api/v1/random',
          content: value,
          datetime: Date.now(),
          type: 1,
        },
      ]);
      setTimeout(() => {
        commentRef?.current?.scrollBottom()
      }, 10)

    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className="chat-wrapper">
      <CommentList comments={comments} commentRef={commentRef} />
      <Editor
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitting={submitting}
        value={value}
      />
    </div>
  );
}

export default Chat
