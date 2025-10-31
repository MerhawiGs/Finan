import { useMemo } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import TopNav from './views/TopNav';
import HomeBody from './views/HomeBody';
import History from './views/History';
import Reports from './views/Reports';
import Settings from './views/Settings';
import BottomNav from './views/BottomNav';
import ManageCards from './views/ManageCards';
import { CardProvider } from './contexts/CardContext';

function NotFound() {
  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-semibold">Page not found</h2>
      <p className="mt-2 text-gray-600">The page you were looking for does not exist.</p>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const pathToView = (path: string) => {
    switch (path) {
      case '/': return 'dashboard';
      case '/history': return 'history';
      case '/reports': return 'reports';
      case '/settings': return 'settings';
      default: return 'dashboard';
    }
  };

  const activeView = useMemo(() => pathToView(location.pathname), [location.pathname]);

  const setView = (view: string) => {
    switch (view) {
      case 'dashboard': return navigate('/');
      case 'history': return navigate('/history');
      case 'reports': return navigate('/reports');
      case 'settings': return navigate('/settings');
      default: return navigate('/');
    }
  };

  const handleAddClick = () => {
    console.log('Add new transaction clicked');
  };

  return (
    <CardProvider>
      <div className="min-h-screen bg-slate-50">
        <TopNav currentView={activeView} />
        <main className="pb-20">
          <Routes>
            <Route path="/" element={<HomeBody />} />
            <Route path="/history" element={<History />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/manage-cards" element={<ManageCards />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <BottomNav 
          activeView={activeView}
          setView={setView}
          onAddClick={handleAddClick}
        />
      </div>
    </CardProvider>
  );
}