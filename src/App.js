import { Route, Routes } from 'react-router';
import './App.css';
import LoginPage from './pages/LoginPage';
import BudgetDashboard from './pages/BudgetDashboard';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/home" element={<BudgetDashboard />} />
    </Routes>);
}

export default App;
