import { type ReactNode } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import { FullPageSpinner } from './components/Spinner';
import { useAuth } from './context/AuthContext';
import DashboardPage  from './pages/DashboardPage';
import EditMonthPage  from './pages/EditMonthPage';
import HistoryPage    from './pages/HistoryPage';
import InsightsPage   from './pages/InsightsPage';
import ProfilePage    from './pages/ProfilePage';
import LoginPage      from './pages/LoginPage';

import Layout from './components/Layout';

function PrivateRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <FullPageSpinner />;
  if (!user)   return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return <FullPageSpinner />;

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/"
        element={<PrivateRoute><DashboardPage /></PrivateRoute>}
      />
      <Route
        path="/edit/:monthId"
        element={<PrivateRoute><EditMonthPage /></PrivateRoute>}
      />
      <Route
        path="/history"
        element={<PrivateRoute><HistoryPage /></PrivateRoute>}
      />
      <Route
        path="/insights"
        element={<PrivateRoute><InsightsPage /></PrivateRoute>}
      />
      <Route
        path="/profile"
        element={<PrivateRoute><ProfilePage /></PrivateRoute>}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
