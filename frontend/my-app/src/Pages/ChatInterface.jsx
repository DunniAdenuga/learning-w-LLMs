import React from 'react';
import '../styles/ChatInterface.css';

function ChatInterface() {
  return (
    <div className="chat-container">
      <h1 className="chat-header">AI Study Assistant</h1>

      <div className="chat-box">
        <div className="message user-message">
          Hey, can you help me with logic problems?
        </div>

        <div className="message ai-message">
          Sure! I’d be happy to help you with logic problems.
        </div>
      </div>

      <div className="message-input-wrapper">
        <input 
          type="text" 
          placeholder="Type your message..." 
          className="message-input"
        />
        <button className="send-button">→</button>
      </div>
    </div>
  );
}

export default ChatInterface;
