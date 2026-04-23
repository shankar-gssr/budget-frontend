import { Route, Routes } from 'react-router';
import './App.css';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/hello" element={<>HI</>} />
      <Route path="/bye" element={<>BYE</>} />
      <Route path="/sleep" element={<>SLEEP</>} />
    </Routes>);
}

export default App;
