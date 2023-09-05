import { Button, Form, Input } from "antd";
import React from "react";

const { TextArea } = Input;

interface EditorProps {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  submitting: boolean;
  value: string;
}

const Editor = ({ onChange, onSubmit, submitting, value }: EditorProps) => (
  <Form className="chat-editor-wrapper">
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value}
        style={{ resize: 'none' }} />
    </Form.Item>
    <Form.Item className="chat-editor-btn">
      <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
        发送
      </Button>
    </Form.Item>
  </Form>
);

export default Editor
