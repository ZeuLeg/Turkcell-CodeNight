import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { AlarmsPage } from './pages/AlarmsPage';
import { SimulatorPage } from './pages/SimulatorPage';
import UsersPage from './pages/UsersPage';
import StationDetailPage from './pages/StationDetailPage';
import RegionSummaryPage from './pages/RegionSummaryPage';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import StationsListPage from './pages/StationsListPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <AppLayout><DashboardPage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/stations" element={
          <ProtectedRoute>
            <AppLayout><StationsListPage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/stations/:id" element={
          <ProtectedRoute>
            <AppLayout><StationDetailPage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/alarms" element={
          <ProtectedRoute>
            <AppLayout><AlarmsPage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/regions" element={
          <ProtectedRoute>
            <AppLayout><RegionSummaryPage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <AppLayout><div className="p-4 text-slate-500">Ayarlar sayfası yakında...</div></AppLayout>
          </ProtectedRoute>
        } />

        {/* Admin-only routes */}
        <Route path="/simulator" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AppLayout><SimulatorPage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/users" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AppLayout><UsersPage /></AppLayout>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
