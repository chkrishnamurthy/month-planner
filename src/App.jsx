import { Navigate, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import EditMonthPage from './pages/EditMonthPage';
import HistoryPage from './pages/HistoryPage';
import InsightsPage from './pages/InsightsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/edit/:monthId" element={<EditMonthPage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/insights" element={<InsightsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
