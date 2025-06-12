import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AssignLecturer from './pages/AssignLecturer';
import CourseManager from './pages/CourseManager';
import BlockCandidate from './pages/BlockCandidate';
import Reports from './pages/Reports';
import ProtectedRoute from './components/Protectedroutes';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/admin/login" element={<Login />} />

          <Route path="/admin/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/admin/assign" element={
            <ProtectedRoute><AssignLecturer /></ProtectedRoute>
          } />
          <Route path="/admin/courses" element={
            <ProtectedRoute><CourseManager /></ProtectedRoute>
          } />
          <Route path="/admin/block" element={
            <ProtectedRoute><BlockCandidate /></ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute><Reports /></ProtectedRoute>
          } />

          {/* fallback */}
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
