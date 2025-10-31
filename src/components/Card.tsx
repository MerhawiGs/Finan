import React from 'react';
import { Plus,CircleUserRound, TrendingUp, TrendingDown, CheckCircle, Wallet, Landmark, HandCoins } from 'lucide-react';

// Enforced fixed width (320px) and height (224px) for visual consistency
export const CARD_SIZING = 'flex-shrink-0 w-80 h-56';

interface FinancialCardProps {
  accountName: string;
  // Updated to include only the four specific types
  icon: 'Wallet' | 'Landmark' | 'CircleUserRound' | 'HandCoins' | 'TrendingUp' | 'TrendingDown' | 'Plus';
  availableBalance: number;
  initialBalance: number;
  targetBalance: number;
  // The four required card types
  cardType: 'credit-card' | 'saving-account' | 'personal-account' | 'investment-card' | 'mine-plus';
  /** whether the card is selected */
  selected?: boolean;
  /** onSelect callback when the card is clicked or activated */
onSelect?: () => void;
}

export default function FinancialCard({
  accountName,
  icon,
  availableBalance,
  initialBalance,
  targetBalance,
  cardType,
  selected = false,
  onSelect,
}: FinancialCardProps) {
  
  // --- Progress & Description Logic ---
  let progressPercentage = 0;
  let progressDescription = cardType === 'credit-card' ? `Budget: ${targetBalance.toLocaleString('en-US', { style: 'currency', currency: 'ETB' })}` : `Target: ${targetBalance.toLocaleString('en-US', { style: 'currency', currency: 'ETB' })}`;
  
  const range = targetBalance - initialBalance;
  const currentProgress = availableBalance - initialBalance;
  
  if (cardType === 'credit-card' && availableBalance < 0 && targetBalance === 0) {
      // Logic for Debt Repayment (e.g., -2000 to 0)
      const initialDebtAbs = Math.abs(initialBalance);
      const paidAmount = initialDebtAbs - Math.abs(availableBalance);
      progressPercentage = (paidAmount / initialDebtAbs) * 100;
      progressDescription = `Paid off: ${paidAmount.toLocaleString('en-US', { style: 'currency', currency: 'ETB' })}`;
  } else if (range !== 0) {
      // Standard Goal Tracking
      progressPercentage = (currentProgress / range) * 100;
  }
  
  // Clamp progress between 0 and 100% for the visualization
  const safeProgressPercent = Math.min(100, Math.max(0, progressPercentage));
  const isNegative = availableBalance < 0;

  // --- Aesthetic Styling (Vibrant Gradients and Text Color) ---
  let gradientClass = '';
  let textColorClass = 'text-white'; // Default text color is white
  let progressColorClass = 'bg-white'; // Default progress bar color is white
  let iconComponent: React.ElementType;
  
  // Mapping the icon name string to the actual Lucide React component
  switch (icon) {
      case 'Wallet': iconComponent = Wallet; break;
      case 'Landmark': iconComponent = Landmark; break;
      case 'CircleUserRound': iconComponent = CircleUserRound; break;
      case 'HandCoins': iconComponent = HandCoins; break;
      case 'TrendingUp': iconComponent = TrendingUp; break;
      case 'TrendingDown': iconComponent = TrendingDown; break;
      case 'Plus': iconComponent = Plus; break;
      default: iconComponent = Wallet; break;
  }
  
  // Assigning the gradient classes based on the four specific types
  switch (cardType) {
      case 'credit-card':
          // Purplish Gradient for Credit Cards (Requested)
          // gradientClass = 'bg-gradient-to-br from-gray-400 to-slate-800'; 
          // gradientClass = 'bg-gradient-to-r from-[#283048] to-[#859398]'; titanium 
          gradientClass = 'bg-gradient-to-r from-[#4b6cb7] to-[#283048]'; 
          break;
      case 'saving-account':
          // Greenish Gradient for Savings (Requested)
          gradientClass = 'bg-gradient-to-r from-emerald-500 via-emerald-500 to-emerald-600';
          break;
      case 'personal-account':
          // Light blue gradient for Personal Account
          gradientClass = 'bg-gradient-to-r from-[#d4e3ff] to-[#8b9bb5]';
          // Set text color to dark for visibility on light background
          textColorClass = 'text-slate-900';
          progressColorClass = 'bg-slate-900';
          break;
      case 'investment-card':
          // Blueish Gradient for Investment (Requested)
          gradientClass = 'bg-gradient-to-br from-blue-600 to-cyan-700';
          break;
      case 'mine-plus':
          // Yellowish Gradient for Mine Plus (Requested)
          gradientClass = ' bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500';
          // **Critical:** Set text color to dark for visibility on light background
          textColorClass = 'text-slate-900';
          progressColorClass = 'bg-slate-900';
          break;
      default:
          gradientClass = 'bg-gradient-to-br from-gray-500 to-slate-600';
          break;
  }
    
  // Icon color remains white for high contrast on dark headers, except for light background cards.
  const iconClass = (cardType === 'mine-plus' || cardType === 'personal-account') ? 'w-5 h-5 text-slate-900' : 'w-5 h-5 text-white';

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onSelect) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      className={`${CARD_SIZING} relative p-5 flex flex-col rounded-xl shadow-lg transition duration-300 cursor-pointer 
        ${gradientClass} 
        ${selected ? 'ring-4 ring-offset-2 ring-white/50 scale-[1.05]' : 'hover:scale-[1.02]'}
      `}
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : -1}
      aria-pressed={selected}
      onClick={() => onSelect && onSelect()}
      onKeyDown={handleKeyDown}
    >
      {/* 1. Account Header and Type */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {/* Icon background is dynamic white/20, icon color is now dynamic based on cardType */}
          <div className={`w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center`}>
            {React.createElement(iconComponent, { className: iconClass })}
          </div>
          <h1 className={`text-base font-medium ${textColorClass}`}>{accountName}</h1>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-semibold bg-white/20 ${textColorClass}`}>
          {(() => {
            switch (cardType) {
              case 'credit-card': return 'CREDIT';
              case 'saving-account': return 'SAVINGS';
              case 'personal-account': return 'PERSONAL';
              case 'investment-card': return 'INVEST';
              case 'mine-plus': return 'MINE+';
              default: return String(cardType).toUpperCase().replace('-', ' ');
            }
          })()}
        </span>
      </div>

      {/* 2. Balance Display */}
      <div className="flex flex-col items-start space-y-1 mb-4">
        <h2 className={`text-3xl font-bold ${textColorClass} tracking-tight`}>
          {availableBalance.toLocaleString('en-US', { style: 'currency', currency: 'ETB' })}
        </h2>
        <p className={`text-sm ${cardType === 'mine-plus' ? 'text-slate-800/90' : 'text-white/90'}`}>
            {isNegative ? 'Remaining Debt' : 'Available Balance'}
        </p>
      </div>

      {/* 3. Progress Bar (Goal/Debt Tracking) */}
      <div className="mt-auto w-full pt-3 border-t" style={{ borderColor: cardType === 'mine-plus' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)'}} aria-hidden={false}>
        <div className="flex justify-between items-center mb-1">
          <span className={`text-xs ${cardType === 'mine-plus' ? 'text-slate-800/90' : 'text-white/90'}`}>
            {cardType === 'credit-card' && availableBalance < 0 ? 'Debt Repaid' : 'Account Progress'}
          </span>
          <span className={`text-xs font-medium ${textColorClass}`}>{Math.round(safeProgressPercent)}%</span>
        </div>
        <div className={`w-full ${cardType === 'mine-plus' ? 'bg-slate-300' : 'bg-white/30'} rounded-full h-2`} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(safeProgressPercent)}>
          <div
            className={`h-2 rounded-full transition-all duration-300 ${progressColorClass}`}
            style={{ width: `${safeProgressPercent}%` }}
          />
        </div>
        <p className={`text-xs ${cardType === 'mine-plus' ? 'text-slate-800/80' : 'text-white/80'} mt-1`}>
          {progressDescription}
        </p>
      </div>

      {/* 4. Selection Indicator (bottom-right) - REMAINS WHITE ON ALL CARDS FOR HIGH VISIBILITY */}
      {selected && (
        <div className="absolute bottom-3 right-3 w-8 h-8 flex items-center justify-center bg-white rounded-full ring-4 ring-indigo-300 shadow-lg text-indigo-600">
            <CheckCircle className="w-5 h-5 fill-indigo-600" />
        </div>
      )}
    </div>
  );
}
