import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Lesson from './pages/Lesson';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

import ProtectedRoute from './components/ProtectedRoute';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/dashboard" element={
          // <ProtectedRoute>
            <Dashboard />
          // </ProtectedRoute>
        } />
        <Route path="/lesson/:id" element={
          // <ProtectedRoute>
            <Lesson />
          // </ProtectedRoute>
        } />
        <Route path="/progress" element={
          // <ProtectedRoute>
            <Progress />
          // </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}