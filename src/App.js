import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import  SignIn  from './Pages/SignIn';
import  SignUp  from './Pages/SignUp';
import ChatInterface from './Pages/ChatInterface';
import Settings from './Pages/Settings';
import ChatHistory from './Pages/ChatHistory';
import Favorites from './Pages/Favorites';
import Profile from './Pages/Profile';
import ChatInterfaceQUIZ from './Pages/ChatInterfaceQUIZ';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/chat" element={<ChatInterface />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/history" element={<ChatHistory />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chatquiz" element={<ChatInterfaceQUIZ/>}/>
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;









