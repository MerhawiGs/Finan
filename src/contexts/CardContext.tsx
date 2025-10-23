import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type CardType = 'credit-card' | 'saving-account' | 'personal-account' | 'investment-card' | 'mine-plus';

interface CardGradient {
  gradientClass: string;
  textColorClass: string;
  cardType: CardType;
}

interface CardContextType {
  selectedCardGradient: CardGradient | null;
  setSelectedCardGradient: (gradient: CardGradient | null) => void;
}

const CardContext = createContext<CardContextType | undefined>(undefined);

export const useCardContext = () => {
  const context = useContext(CardContext);
  if (context === undefined) {
    throw new Error('useCardContext must be used within a CardProvider');
  }
  return context;
};

interface CardProviderProps {
  children: ReactNode;
}

export const CardProvider: React.FC<CardProviderProps> = ({ children }) => {
  const [selectedCardGradient, setSelectedCardGradient] = useState<CardGradient | null>(null);

  return (
    <CardContext.Provider value={{ selectedCardGradient, setSelectedCardGradient }}>
      {children}
    </CardContext.Provider>
  );
};
