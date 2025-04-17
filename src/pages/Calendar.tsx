
import { useState } from "react";
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import LeaveCalendar from "@/components/calendar/LeaveCalendar";
import TeamCalendarView from "@/components/admin/TeamCalendarView";

const Calendar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("my-calendar");

  return (
    <>
      <Helmet>
        <title>Team Calendar - LeaveFlow</title>
      </Helmet>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex flex-1">
          <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 p-6 md:ml-64 transition-all duration-300">
            <div className="container mx-auto">
              <h1 className="text-2xl font-bold mb-6">Leave Calendar</h1>
              
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
                <TabsList>
                  <TabsTrigger value="my-calendar">My Calendar</TabsTrigger>
                  <TabsTrigger value="team-calendar">Team Calendar</TabsTrigger>
                </TabsList>
                <TabsContent value="my-calendar" className="mt-6">
                  <LeaveCalendar />
                </TabsContent>
                <TabsContent value="team-calendar" className="mt-6">
                  <TeamCalendarView />
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Calendar;
