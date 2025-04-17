
import { useState } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import DashboardOverview from "@/components/dashboard/DashboardOverview";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>Dashboard - LeaveFlow</title>
      </Helmet>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex flex-1">
          <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 p-6 md:ml-64 transition-all duration-300">
            <div className="container mx-auto">
              <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
              <DashboardOverview />
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Dashboard;
