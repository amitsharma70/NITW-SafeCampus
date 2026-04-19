import { Outlet } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import AppHeader from "../components/AppHeader";

const AppLayout = () => {
  return (
    <>
      <AppHeader />
      <Outlet />
      <BottomNav />
    </>
  );
};

export default AppLayout;
