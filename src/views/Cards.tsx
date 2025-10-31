import { useEffect, useState } from 'react';
import FinancialCard from "../components/Card";
import { ChevronRight } from "lucide-react";
import { useCardContext } from "../contexts/CardContext";
import { Link } from 'react-router-dom'

// Function to get gradient information for each card type
const getCardGradientInfo = (cardType: string) => {
  switch (cardType) {
    case 'credit-card':
      return {
        gradientClass: 'bg-gradient-to-r from-[#283048] to-[#859398]',
        textColorClass: 'text-white',
        cardType: 'credit-card' as const
      };
    case 'saving-account':
      return {
        gradientClass: 'bg-gradient-to-r from-emerald-500 via-emerald-500 to-emerald-600',
        textColorClass: 'text-white',
        cardType: 'saving-account' as const
      };
    case 'personal-account':
      return {
        gradientClass: 'bg-gradient-to-r from-[#E0EAFC] to-[#CFDEF3]',
        textColorClass: 'text-slate-900',
        cardType: 'personal-account' as const
      };
    case 'investment-card':
      return {
        gradientClass: 'bg-gradient-to-br from-blue-600 to-cyan-700',
        textColorClass: 'text-white',
        cardType: 'investment-card' as const
      };
    case 'mine-plus':
      return {
        gradientClass: 'bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500',
        textColorClass: 'text-slate-900',
        cardType: 'mine-plus' as const
      };
    default:
      return {
        gradientClass: 'bg-gradient-to-br from-gray-500 to-slate-600',
        textColorClass: 'text-white',
        cardType: 'credit-card' as const
      };
  }
};

// API base
const API = import.meta.env.VITE_API_URL ?? 'https://finan-back-qmph.onrender.com';

// Mock Data Structure (Embedded for demonstration)
// Default five accounts created with initial amounts = 0
const MOCK_ACCOUNTS = [
  {
    _id: '1',
    accountName: "Checking Account",
    icon: "Wallet" as const,
    availableBalance: 0.00,
    initialBalance: 0.00,
    targetBalance: 0.00,
    cardType: "credit-card" as const,
  },
  {
    _id: '2',
    accountName: "Savings Account",
    icon: "Landmark" as const,
    availableBalance: 0.00,
    initialBalance: 0.00,
    targetBalance: 0.00,
    cardType: "saving-account" as const,
  },
  {
    _id: '3',
    accountName: "Personal Account",
    icon: "CircleUserRound" as const,
    availableBalance: 0.00,
    initialBalance: 0.00,
    targetBalance: 0.00,
    cardType: "personal-account" as const,
  },
  {
    _id: '4',
    accountName: "Investments",
    icon: "HandCoins" as const,
    availableBalance: 0.00,
    initialBalance: 0.00,
    targetBalance: 0.00,
    cardType: "investment-card" as const,
  },
  {
    _id: '5',
    accountName: "Mine Plus",
    icon: "Plus" as const,
    availableBalance: 0.00,
    initialBalance: 0.00,
    targetBalance: 0.00,
    cardType: "mine-plus" as const,
  },
];

export default function Cards() {
  const { setSelectedCardGradient } = useCardContext();
  const [cards, setCards] = useState<any[]>(MOCK_ACCOUNTS);
  const [activeAccountId, setActiveAccountId] = useState<string>(MOCK_ACCOUNTS[0]._id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchCards = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/cards`);
        if (!res.ok) throw new Error('Failed to fetch cards');
        const data = await res.json();
        if (!mounted) return;
        setCards(data);
        if (data.length > 0) {
          const firstId = data[0]._id || data[0].id;
          setActiveAccountId(firstId);
          const gradientInfo = getCardGradientInfo(data[0].cardType);
          setSelectedCardGradient(gradientInfo);
        } else {
          const gradientInfo = getCardGradientInfo(MOCK_ACCOUNTS[0].cardType as string);
          setSelectedCardGradient(gradientInfo);
        }
      } catch (err: any) {
        console.warn('Could not fetch cards, using mock data', err);
        setError(err.message || 'Failed to load cards');
        const gradientInfo = getCardGradientInfo(MOCK_ACCOUNTS[0].cardType as string);
        setSelectedCardGradient(gradientInfo);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
    return () => { mounted = false; };
  }, [setSelectedCardGradient]);

  const handleCardSelect = (accountId: string) => {
    setActiveAccountId(accountId);
    const selectedAccount = cards.find(account => (account._id || account.id) === accountId);
    if (selectedAccount) {
      const gradientInfo = getCardGradientInfo(selectedAccount.cardType);
      setSelectedCardGradient(gradientInfo);
    }
  };

  return (
    <div className="w-full max-w-4xl">
      {/* Carousel Container: Horizontal Scroll */}
      <div className="flex gap-4 overflow-x-auto justify-start p-4 hide-scrollbar">
        {loading ? (
          <div className="p-6">Loading cards...</div>
        ) : (
          cards.map((account: any) => (
            <FinancialCard
              key={account._id || account.id}
              accountName={account.accountName}
              icon={account.icon}
              availableBalance={account.availableBalance}
              initialBalance={account.initialBalance}
              targetBalance={account.targetBalance}
              cardType={account.cardType}
              selected={(account._id || account.id) === activeAccountId}
              onSelect={() => handleCardSelect(account._id || account.id)}
            />
          ))
        )}
      </div>

      {/* Manage Cards Link */}
      <div className="flex justify-end px-4 text-right my-2">
        {/* Note: In a real app, this should navigate to your Manage Accounts view */}
        <Link 
          to="/manage-cards"
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition duration-150"
        >
          Manage Accounts <ChevronRight size={16} className="ml-1" />
        </Link>
      </div>
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </div>
  );
}
