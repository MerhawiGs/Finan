import { useState } from 'react';
import TopNav from './views/TopNav';
import HomeBody from './views/HomeBody';
import History from './views/History';
import Reports from './views/Reports';
import Settings from './views/Settings';
import BottomNav from './views/BottomNav';
import { CardProvider } from './contexts/CardContext';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  
  const handleAddClick = () => {
    console.log('Add new transaction clicked');
  };

  // Render the appropriate view based on activeView
  const renderCurrentView = () => {
    switch (activeView) {
      case 'dashboard':
        return <HomeBody />;
      case 'history':
        return <History />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <HomeBody />;
    }
  };

  return (
    <CardProvider>
      <div className="min-h-screen bg-slate-50">
        <TopNav currentView={activeView} />
        <main className="pb-20">
          {renderCurrentView()}
        </main>
        <BottomNav 
          activeView={activeView}
          setView={setActiveView}
          onAddClick={handleAddClick}
        />
      </div>
    </CardProvider>
  )
}