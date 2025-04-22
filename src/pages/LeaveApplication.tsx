
import { useState } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import LeaveApplicationForm from "@/components/leave/LeaveApplicationForm";

const LeaveApplication = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>Apply for Leave - IST Africa</title>
      </Helmet>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex flex-1">
          <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 p-6 md:ml-64 transition-all duration-300">
            <div className="container mx-auto max-w-4xl">
              <h1 className="text-2xl font-bold mb-6">Apply for Leave</h1>
              <LeaveApplicationForm />
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default LeaveApplication;
