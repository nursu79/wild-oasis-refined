import SideNavigation from "@/app/_components/SideNavigation";
import AccountTransition from "@/app/_components/AccountTransition";

export default function Layout({ children }) {
  return (
    <div className="grid grid-cols-[16rem_1fr] h-full gap-16">
      <SideNavigation />
      <div className="py-2">
        <AccountTransition>{children}</AccountTransition>
      </div>
    </div>
  );
}
