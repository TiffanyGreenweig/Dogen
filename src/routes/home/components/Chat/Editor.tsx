import { Button, Form, Input } from "antd";
import React, { useState } from "react";

const { TextArea } = Input;

const Editor = ({ onSubmit }: any) => {
  const [chatForm] = Form.useForm()
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
    <Form className="chat-editor-wrapper" form={chatForm}>
      <Form.Item name="text">
        <TextArea rows={4} readOnly={submitting}
          style={{ resize: 'none' }} />
      </Form.Item>
      <Form.Item className="chat-editor-btn">
        <Button htmlType="submit" loading={submitting} onClick={handleSubmit} type="primary">
          发送
        </Button>
      </Form.Item>

    </Form>
  )
};

export default Editor
