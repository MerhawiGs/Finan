import { CreditCard, ShoppingCart, DollarSign, TrendingUp, TrendingDown, CheckCircle } from 'lucide-react';

// Shared sizing for all financial cards. Mobile-first: full width on very small screens,
// consistent fixed card size from `sm` and up.
export const CARD_SIZING = 'w-full sm:w-[560px] sm:h-[240px]';

interface FinancialCardProps {
  accountName: string;
  icon?: 'credit-card' | 'shopping-cart' | 'dollar-sign' | 'trending-up' | 'trending-down';
  availableBalance: number;
  initialBalance?: number;
  cardType?: 'expense' | 'income' | 'investment';
  /** whether the card is selected */
  selected?: boolean;
  /** onSelect callback when the card is clicked or activated */
  onSelect?: () => void;
}

export default function FinancialCard({
  accountName,
  icon,
  availableBalance,
  initialBalance = availableBalance,
  cardType = 'income',
  selected = false,
  onSelect,
}: FinancialCardProps) {
  const progressPercentage = initialBalance > 0 ? (availableBalance / initialBalance) * 100 : 0;
  const isExpense = cardType === 'expense';

  let gradientClass = 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500';
  let textColorClass = 'text-white';

  if (isExpense) {
    gradientClass = 'bg-gradient-to-r from-red-500 via-red-400 to-pink-500';
    textColorClass = 'text-white';
  } else if (cardType === 'investment') {
    // yellow / amber gradient for investments
    gradientClass = 'bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500';
    // dark text looks better on yellow backgrounds
    textColorClass = 'text-slate-900';
  }
    

  const iconClass = 'w-5 h-5 text-white';

  const getIcon = () => {
    // if explicit icon provided, use it
    if (icon) {
      switch (icon) {
        case 'credit-card':
          return <CreditCard className={iconClass} />;
        case 'shopping-cart':
          return <ShoppingCart className={iconClass} />;
        case 'dollar-sign':
          return <DollarSign className={iconClass} />;
        case 'trending-up':
          return <TrendingUp className={iconClass} />;
        case 'trending-down':
          return <TrendingDown className={iconClass} />;
      }
    }

    // choose a sensible default based on card type
    switch (cardType) {
      case 'investment':
        return <TrendingUp className={iconClass} />;
      case 'expense':
        return <TrendingDown className={iconClass} />;
      case 'income':
      default:
        return <DollarSign className={iconClass} />;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onSelect) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      className={`${CARD_SIZING} relative p-5 flex flex-col rounded-[14px] shadow-lg ${gradientClass} backdrop-blur-lg`}
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : -1}
      aria-pressed={selected}
      onClick={() => onSelect && onSelect()}
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">{getIcon()}</div>
          <h1 className={`text-base font-medium ${textColorClass}`}>{accountName}</h1>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${isExpense ? 'bg-white/20 text-white' : 'bg-white/20 text-white'}`}>
          {cardType.toUpperCase()}
        </span>
      </div>

      <div className="flex flex-col items-start space-y-1 mb-4">
        <h2 className={`text-3xl font-bold ${textColorClass}`}>
          ${availableBalance.toLocaleString()}
        </h2>
        <p className={`text-sm ${cardType === 'investment' ? 'text-slate-800/80' : 'text-white/90'}`}>Available Balance</p>
      </div>

      <div className="mt-auto w-full" aria-hidden={false}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-white/90">Progress</span>
          <span className="text-xs font-medium text-white">{progressPercentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.min(Math.max(Math.round(progressPercentage), 0), 100)}>
          <div
            className={`h-2 rounded-full transition-all duration-300 ${isExpense ? 'bg-rose-200/80' : cardType === 'investment' ? 'bg-yellow-200/80' : 'bg-emerald-200/80'}`}
            style={{ width: `${Math.min(Math.max(progressPercentage, 0), 100)}%` }}
          />
        </div>
        <p className="text-xs text-white/80 mt-1">
          {isExpense ? `Spent: $${(initialBalance - availableBalance).toLocaleString()}` : `Earned: $${availableBalance.toLocaleString()}`}
        </p>
      </div>
      {/* selection indicator (bottom-right) */}
      {selected && (
        <div className="absolute bottom-3 right-3 bg-white/10 p-1 rounded-full">
          <CheckCircle className="w-6 h-6 text-white" />
        </div>
      )}
    </div>
  );
}