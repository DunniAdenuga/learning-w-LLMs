// <<<<<<< frontend-harmony
// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
// =======
import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  const sendMessageToChatGPT = async () => {
    try {
      // Make a POST request to OpenAI's API or a similar third-party API
      const result = await axios.post(
        'https://api.openai.com/v1/completions', // OpenAI endpoint
        {
          model: "gpt-4", // Specify the model you want to use
          prompt: message, // The message sent from the user
          max_tokens: 100 // Limit on the number of tokens in the response
        },
        {
          headers: {
            Authorization: `Bearer YOUR_OPENAI_API_KEY`, // Replace with your API key
          }
        }
      );
      // Update the state with the response from the API
      setResponse(result.data.choices[0].text);
    } catch (error) {
      console.error('Error while sending message:', error);
      setResponse('There was an error with the request.');
    }
  };

  return (
    <div className="App">
      <h1>ChatGPT API Frontend</h1>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={sendMessageToChatGPT}>Send Message</button>

      <div>
        <h2>Response:</h2>
        <p>{response}</p>
      </div>
    </div>
  );
}

export default App;
