import { useEffect, useState } from "react";
import { Wifi, WifiOff } from "lucide-react"; // install: npm install lucide-react
import { useCardContext } from "../contexts/CardContext";

interface TopNavProps {
  currentView?: string;
}

export default function TopNav({ currentView = 'dashboard' }: TopNavProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [fromInternet, setFromInternet] = useState(false);
  const { selectedCardGradient } = useCardContext();

  useEffect(() => {
    async function fetchOnlineTime() {
      try {
        const response = await fetch("https://timeapi.io/api/Time/current/zone?timeZone=Europe/London");
        if (!response.ok) throw new Error("API error");
        const data = await response.json();

        // Validate the response data
        if (!data.year || !data.month || !data.day || !data.hour || !data.minute || !data.seconds) {
          throw new Error("Invalid time data received");
        }

        // Build a date object from fetched time
        const fetchedDate = new Date(
          `${data.year}-${String(data.month).padStart(2, "0")}-${String(data.day).padStart(2, "0")}T${data.hour}:${data.minute}:${data.seconds}`
        );

        // Validate the date is not invalid
        if (isNaN(fetchedDate.getTime())) {
          throw new Error("Invalid date created from API response");
        }

        setCurrentTime(fetchedDate);
        setFromInternet(true);
        console.log("Time updated from internet:", fetchedDate.toISOString());
      } catch (error) {
        console.warn("Failed to fetch internet time, using browser time:", error);
        setCurrentTime(new Date());
        setFromInternet(false);
      }
    }

    // Always try to fetch internet time first
    fetchOnlineTime();

    // Update every 60 seconds - always try internet first, fallback to browser time
    const interval = setInterval(() => {
      if (navigator.onLine) {
        fetchOnlineTime();
      } else {
        console.log("Offline - using browser time");
        setCurrentTime(new Date());
        setFromInternet(false);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Get the gradient and text color from selected card, or use default
  const headerGradient = selectedCardGradient?.gradientClass || 'bg-white';
  const textColor = selectedCardGradient?.textColorClass || 'text-gray-900';
  const borderColor = selectedCardGradient ? 'border-white/20' : 'border-gray-100';

  // Get view title
  const getViewTitle = (view: string) => {
    switch (view) {
      case 'dashboard': return 'Dashboard';
      case 'history': return 'Transaction History';
      case 'reports': return 'Financial Reports';
      case 'settings': return 'Settings';
      default: return 'Dashboard';
    }
  };

  return (
    <header className={`p-4 ${headerGradient} border-b ${borderColor} flex justify-between items-center sticky top-0 z-20 transition-all duration-500`}>
      <div>
        <h1 className={`text-2xl font-extrabold ${textColor}`}>
          Hi, Merhawi!
        </h1>
        <p className={`text-sm ${selectedCardGradient ? 'text-white/80' : 'text-gray-600'}`}>
          {getViewTitle(currentView)}
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <span className={`text-sm font-medium ${selectedCardGradient ? 'text-white/90' : 'text-gray-500'}`}>
          {currentTime.toLocaleString("en-GB", {
            timeZone: "Europe/London",
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>

        {fromInternet ? (
          <Wifi className={`w-4 h-4 ${selectedCardGradient ? 'text-green-300' : 'text-green-500'}`} />
        ) : (
          <WifiOff className={`w-4 h-4 ${selectedCardGradient ? 'text-white/60' : 'text-gray-400'}`} />
        )}
      </div>
    </header>
  );
}