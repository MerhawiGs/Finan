import { useState } from 'react';
import TopNav from './views/TopNav';
import HomeBody from './views/HomeBody';
import BottomNav from './views/BottomNav';
import { CardProvider } from './contexts/CardContext';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  
  const handleAddClick = () => {
    console.log('Add new transaction clicked');
  };

  return (
    <CardProvider>
      <div>
        <TopNav />
        <HomeBody />
        <BottomNav 
          activeView={activeView}
          setView={setActiveView}
          onAddClick={handleAddClick}
        />
      </div>
    </CardProvider>
  )
}