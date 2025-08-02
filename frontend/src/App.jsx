import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Chatbot from './pages/Chatbot';
import CodePlayground from './pages/CodePlayground';
import CommunicationPage from './pages/CommunicationPage';
import CommunicationTest from './pages/CommunicationTest';
import CommunicationResults from './pages/CommunicationResults';
import TaskManager from './pages/TaskManager';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />}/>
        <Route path='/settings' element={<Settings/>}/>
        <Route path='/chatbot' element={<Chatbot/>}/>
        <Route path='/code' element={<CodePlayground/>}/>
        <Route path='/communication' element={<CommunicationPage/>}/>
        <Route path='/communication/test' element={<CommunicationTest/>}/>
        <Route path='/communication/results' element={<CommunicationResults/>}/>
        <Route path='/task' element={<TaskManager/>}/>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
