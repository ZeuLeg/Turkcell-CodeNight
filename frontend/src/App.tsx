import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { AlarmsPage } from './pages/AlarmsPage';
import { SimulatorPage } from './pages/SimulatorPage';
import { AppLayout } from './components/layout/AppLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Dashboard Route with Layout */}
        <Route path="/dashboard" element={
          <AppLayout>
            <DashboardPage />
          </AppLayout>
        } />
        
        {/* Placeholder routes for Sidebar links */}
        <Route path="/stations" element={<AppLayout><div>İstasyonlar Sayfası</div></AppLayout>} />
        <Route path="/alarms" element={<AppLayout><AlarmsPage /></AppLayout>} />
        <Route path="/simulator" element={<AppLayout><SimulatorPage /></AppLayout>} />
        <Route path="/users" element={<AppLayout><div>Kullanıcılar Sayfası</div></AppLayout>} />
        <Route path="/settings" element={<AppLayout><div>Ayarlar Sayfası</div></AppLayout>} />

        {/* Default route to login for now */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;