import FinancialCard from "../components/Card";
import { ChevronRight } from "lucide-react";
export default function Cards() {
    return (
        <div className="w-full max-w-4xl p-4 mt-4">
        <div className="flex gap-4 overflow-x-auto justify-start p-4 hide-scrollbar">
          <FinancialCard
            accountName="Checking Account"
            icon="credit-card"
            availableBalance={800}
            initialBalance={1000}
            cardType="income"
          />
          <FinancialCard
            accountName="Savings Card"
            icon="trending-down"
            availableBalance={100}
            initialBalance={1000}
            cardType="expense"
          />
          <FinancialCard
            accountName="Investment Account"
            icon="dollar-sign"
            availableBalance={4000}
            initialBalance={2000}
            cardType="investment"
          />
        </div>
        <div className="flex justify-end p-4">
          <a href="#" className="flex flex-row items-center gap-1">
            Manage cards <ChevronRight className="size-4" />
          </a>
        </div>
      </div>
    );
}