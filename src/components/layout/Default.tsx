import { useState } from "react";
import { Helmet } from "react-helmet";
;
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

interface DefaultProps {
  children: React.ReactNode;
  title?: string;

}

export default function DefaultLayout({ children, title }: DefaultProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>{title ?? 'Manager'} - IST Africa</title>
      </Helmet>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex flex-1">
          <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 p-6 md:ml-64 transition-all duration-300">
            {children}
          </main>
        </div>
        <Footer />
      </div>
    </>
  )
}