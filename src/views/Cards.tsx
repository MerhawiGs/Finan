import React, { useState } from 'react';
import FinancialCard from "../components/Card";
import { ChevronRight } from "lucide-react";
import { useCardContext } from "../contexts/CardContext";

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

// Mock Data Structure (Embedded for demonstration)
const MOCK_ACCOUNTS = [
    { 
        id: 1, 
        accountName: "Checking Account", 
        icon: "Wallet" as const, 
        availableBalance: 4521.50, 
        initialBalance: 4000.00, 
        targetBalance: 5000.00,
        cardType: "credit-card" as const,
    },
    { 
        id: 2, 
        accountName: "Savings Account", 
        icon: "Landmark" as const, 
        availableBalance: -1078.50, // Remaining debt
        initialBalance: -2000.00, // Initial debt
        targetBalance: 0.00, // Goal is zero debt
        cardType: "saving-account" as const,
    },
    { 
        id: 3, 
        accountName: "Personal Account", 
        icon: "Landmark" as const, 
        availableBalance: 10000.50, // Remaining debt
        initialBalance: 2000.00, // Initial debt
        targetBalance: 0.00, // Goal is zero debt
        cardType: "personal-account" as const,
    },
    { 
        id: 4, 
        accountName: "Investments", 
        icon: "HandCoins" as const, 
        availableBalance: 15300.00, 
        initialBalance: 10000.00, 
        targetBalance: 20000.00,
        cardType: "investment-card" as const, 
    },
    { 
        id: 5, 
        accountName: "Mine Plus", 
        icon: "Plus" as const, 
        availableBalance: 250.00, 
        initialBalance: 0.00, 
        targetBalance: 1500.00,
        cardType: "mine-plus" as const,
    },
];

export default function Cards() {
    // State to track the currently active/selected account ID
    const [activeAccountId, setActiveAccountId] = useState(MOCK_ACCOUNTS[0].id);
    const { setSelectedCardGradient } = useCardContext();

    // Function to handle card selection
    const handleCardSelect = (accountId: number) => {
        setActiveAccountId(accountId);
        const selectedAccount = MOCK_ACCOUNTS.find(account => account.id === accountId);
        if (selectedAccount) {
            const gradientInfo = getCardGradientInfo(selectedAccount.cardType);
            setSelectedCardGradient(gradientInfo);
        }
    };

    // Set initial gradient for the first card
    React.useEffect(() => {
        const firstAccount = MOCK_ACCOUNTS[0];
        const gradientInfo = getCardGradientInfo(firstAccount.cardType);
        setSelectedCardGradient(gradientInfo);
    }, [setSelectedCardGradient]);

    return (
        <div className="w-full max-w-4xl">
            {/* Carousel Container: Horizontal Scroll */}
            <div className="flex gap-4 overflow-x-auto justify-start p-4 hide-scrollbar">
                {MOCK_ACCOUNTS.map(account => (
                    <FinancialCard
                        key={account.id}
                        accountName={account.accountName}
                        icon={account.icon}
                        availableBalance={account.availableBalance}
                        initialBalance={account.initialBalance}
                        targetBalance={account.targetBalance}
                        cardType={account.cardType}
                        selected={account.id === activeAccountId}
                        onSelect={() => handleCardSelect(account.id)}
                    />
                ))}
            </div>
            
            {/* Manage Cards Link */}
            <div className="flex justify-end px-4 text-right my-2">
                {/* Note: In a real app, this should navigate to your Manage Accounts view */}
                <button 
                    onClick={() => console.log('Navigate to Manage Accounts')} 
                    className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition duration-150"
                >
                    Manage Accounts <ChevronRight size={16} className="ml-1" />
                </button>
            </div>
        </div>
    );
}
