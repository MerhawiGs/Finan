import Cards from "./Cards";
import WeeklyReport from "./WeeklyReport";
import RecentTransactions from "./RecentTransactions";

export default function HomeBody() {
  return (
    <>
      <Cards />
      <WeeklyReport />
      <RecentTransactions />
    </>
  );
}
