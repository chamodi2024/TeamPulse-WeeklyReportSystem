import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRedirect from './routes/RoleRedirect';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import MyReports from './pages/member/MyReports';
import NewReport from './pages/member/NewReport';
import EditReport from './pages/member/EditReport';
import Dashboard from './pages/manager/Dashboard';
import TeamReports from './pages/manager/TeamReports';
import Projects from './pages/manager/Projects';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/member/reports" element={<ProtectedRoute allowedRoles={['MEMBER', 'MANAGER']}><MyReports /></ProtectedRoute>} />
          <Route path="/member/reports/new" element={<ProtectedRoute allowedRoles={['MEMBER', 'MANAGER']}><NewReport /></ProtectedRoute>} />
          <Route path="/member/reports/:id/edit" element={<ProtectedRoute allowedRoles={['MEMBER', 'MANAGER']}><EditReport /></ProtectedRoute>} />

          <Route path="/manager/dashboard" element={<ProtectedRoute allowedRoles={['MANAGER']}><Dashboard /></ProtectedRoute>} />
          <Route path="/manager/team-reports" element={<ProtectedRoute allowedRoles={['MANAGER']}><TeamReports /></ProtectedRoute>} />
          <Route path="/manager/projects" element={<ProtectedRoute allowedRoles={['MANAGER']}><Projects /></ProtectedRoute>} />

          <Route path="/unauthorized" element={<div className="min-h-screen flex items-center justify-center bg-surface-50"><p className="text-red-600 font-semibold">You are not authorized to view this page.</p></div>} />

          <Route path="/" element={<RoleRedirect />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;