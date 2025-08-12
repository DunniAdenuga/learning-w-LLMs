import React, {useState} from 'react';
import '../styles/ChatInterface.css';
import Navigation from "../components/Navigation/Navigation";//New component
import MainLayout from '../layouts/MainLayout';

function ChatInterface() {
  const [messages, setMessages]= useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (inputValue.trim() === "") return;
    // Add user message to chat
    setMessages([...messages, { text: inputValue, sender: 'user' }]);
    setInputValue("");  

    // fake AI message - replace with actual AI response logic after
    setTimeout(() => {
      const aiMessage = { text: "This is a test AI response!", sender: 'ai' };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    }, 800); // 800ms delay to simulate thinking
  }

  return (
    <MainLayout>
      <div className="chat-container">
        <h1 className="chat-header">AI Study Assistant</h1>

        <div className="chat-box">
          <div className="message user-message">
            Hey, can you help me with logic problems?
          </div>

          <div className="message ai-message">
            Sure! I’d be happy to help you with logic problems.
          </div>

          {messages.map((message, index) => (
          <div 
            key={index} 
            className={`message ${message.sender}-message`}
          >
            {message.text}
          </div>
        ))}
        </div>

        <div className="message-input-wrapper">
          <input 
            type="text" 
            placeholder="Type your message..." 
            className="message-input"
            value = {inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button className="send-button" type="submit" onClick={handleSubmit}>→</button>
        </div>
      </div>
    </MainLayout>
  );
}

export default ChatInterface;
