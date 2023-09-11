import React, { useState } from "react";
import { Button, Form, Input } from "antd";

import './index.less'

const { TextArea } = Input;

const ChatInput = ({ onSubmit, chatForm }: any) => {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    const text = chatForm.getFieldValue('text')
    if (!text) return
    onSubmit?.(text)
    setTimeout(() => {
      chatForm.resetFields()
      setSubmitting(false)
    }, 200)
  };

  return (
    <Form className="chat-ChatInput-wrapper" form={chatForm}>
      <Form.Item name="text">
        <TextArea rows={4} readOnly={submitting}
          style={{ resize: 'none' }} />
      </Form.Item>
      <Form.Item className="chat-ChatInput-btn">
        <Button htmlType="submit" loading={submitting} onClick={handleSubmit} type="primary">
          发送
        </Button>
      </Form.Item>

    </Form>
  )
};

export default ChatInput
