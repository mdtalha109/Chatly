import './App.css';
import {Routes, Route} from 'react-router-dom'
import HomePage from './Pages/HomePage/HomePage'
import ChatPage from './Pages/ChatPage'
import SignupPage from './Pages/SignupPage/SignupPage';


function App() {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<HomePage/>}> </Route>
        <Route exact path="/signup" element={<SignupPage/>}> </Route>

        <Route path="/chat" element={<ChatPage/>}> </Route>
      </Routes>

    </>
  );
}

export default App;
