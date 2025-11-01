import React from 'react';
import { Home, Settings, Plus, Clock3, BarChart3 } from 'lucide-react';

type BottomNavProps = {
    activeView: string;
    setView: (view: string) => void;
    onAddClick: () => void;
};

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setView, onAddClick }) => {
    // Icons were updated in the previous step: History (Clock3) and Reports (BarChart3)
    const navItems = [
        { name: 'Home', icon: Home, view: 'dashboard' },
        { name: 'Budget', icon: Clock3, view: 'history' },
        { name: 'Reports', icon: BarChart3, view: 'reports' },
        { name: 'Settings', icon: Settings, view: 'settings' },
    ];
    
    // Split items for placement around the center FAB
    const leftItems = navItems.slice(0, 2); // Home, History
    const rightItems = navItems.slice(2); // Reports, Settings

    return (
        <div className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-200 shadow-2xl z-30"> 
            <div className="flex justify-between items-center h-full max-w-lg mx-auto px-4">
                
                {/* Left Items */}
                <nav aria-label="Primary" className="flex space-x-12">
                    { leftItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeView === item.view;
                        const colorClass = isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-500';

                        return (
                            <button
                                key={item.name}
                                onClick={() => setView(item.view)}
                                aria-current={isActive ? 'page' : undefined}
                                className={`flex flex-col items-center text-xs pt-1 transition-colors duration-200 ${colorClass} focus:outline-none`}
                                aria-label={item.name}
                            >
                                <Icon size={24} strokeWidth={2} />
                                <span className="mt-1 font-medium">{item.name}</span>
                            </button>
                        );
                    })}
                </nav>
                
                {/* Center FAB Button */}
                <button
                    onClick={onAddClick}
                    // Positioned absolutely to float above the dock and centered
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 p-3 rounded-full bg-indigo-600 text-white shadow-xl hover:bg-indigo-700 transition duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-indigo-300 w-16 h-16 flex items-center justify-center"
                    aria-label="Add New Transaction"
                >
                    <Plus size={32} strokeWidth={3} />
                </button>
                
                {/* Right Items */}
                <nav aria-label="Secondary" className="flex space-x-12">
                    {rightItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeView === item.view;
                        const colorClass = isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-500';

                        return (
                            <button
                                key={item.name}
                                onClick={() => setView(item.view)}
                                aria-current={isActive ? 'page' : undefined}
                                className={`flex flex-col items-center text-xs pt-1 transition-colors duration-200 ${colorClass} focus:outline-none`}
                                aria-label={item.name}
                            >
                                <Icon size={24} strokeWidth={2} />
                                <span className="mt-1 font-medium">{item.name}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
};

export default BottomNav;
