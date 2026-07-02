import { Navigate, Route, Routes } from 'react-router-dom';

import Shell from './components/Shell.jsx';
import Analytics from './pages/Analytics.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import MapPage from './pages/MapPage.jsx';
import Register from './pages/Register.jsx';
import ReportIssue from './pages/ReportIssue.jsx';
import { getToken } from './api/client.js';

function RequireAuth({ children }) {
  return getToken() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <Shell />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="report" element={<ReportIssue />} />
        <Route path="map" element={<MapPage />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>
    </Routes>
  );
}

