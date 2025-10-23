import Cards from "./Cards";
import WeeklyReport from "../components/WeeklyReport";
import RecentTransactions from "../components/RecentTransactions";

interface HomeBodyProps {
  onNavigateToHistory?: () => void;
}

export default function HomeBody({ onNavigateToHistory }: HomeBodyProps) {
  return (
    <>
      <Cards />
      <WeeklyReport />
      <RecentTransactions onViewAll={onNavigateToHistory} />
    </>
  );
}
