// src/ChatComponent.js
import React, { useState, useEffect } from 'react';
import { ChatEngine } from 'react-chat-engine';
import './ChatComponent.css';

const ChatComponent = () => {
  const [chatConfig, setChatConfig] = useState(null);

  useEffect(() => {
    fetch('/api/chat-credentials')
      .then(response => response.json())
      .then(data => setChatConfig(data));
  }, []);

  if (!chatConfig) {
    return <div>Loading...</div>;
  }

  return (
    <div className="chat-container">
      <ChatEngine
        height="100vh"
        projectID={chatConfig.projectID}
        userName={chatConfig.userName}
        userSecret={chatConfig.userSecret}
      />
    </div>
  );
};

export default ChatComponent;
