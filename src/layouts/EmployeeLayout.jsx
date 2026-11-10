import { Outlet } from "react-router-dom";
import "../App.css";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { DashboardProvider } from "../context/DataContext";

export default function EmployeeLayout() {
  return <DashboardProvider>
    <div className="flex flex-col md:flex-row md:h-screen w-full bg-(--bg-main) text-(--text-main)">
      <aside className="hidden md:flex md:w-64 flex-col border-r border-(--sidebar-border) bg-(--sidebar-nav-bg) shrink-0">
        <div className="h-16 flex items-center px-6"><span className="font-bold text-xl text-text-main">WorkLane</span></div>
        <Navbar />
      </aside>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="md:hidden h-16 flex items-center px-6 border-b border-(--sidebar-border) bg-(--sidebar-nav-bg) shrink-0"><span className="font-bold text-lg text-text-main">WorkLane</span></div>
        <div className="md:min-h-16 border-b border-(--border) bg-(--sidebar-bg)"><Header /></div>
        <div className="md:hidden border-b border-(--sidebar-border) bg-(--sidebar-nav-bg) shrink-0"><Navbar /></div>
        <div className="flex-1 overflow-y-auto"><Outlet /></div>
      </div>
    </div>
  </DashboardProvider>;
}
