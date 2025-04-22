import EmployeeManagement from "@/components/admin/EmployeeManagement";
import { useState } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";

export default function Employee() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        <>
            <Helmet>
                <title>Employee - IST Africa</title>
            </Helmet>
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <div className="flex flex-1">
                    <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                    <main className="flex-1 p-6 md:ml-64 transition-all duration-300">
                        <div className="container mx-auto">
                            <EmployeeManagement />
                        </div>
                    </main>
                </div>
                <Footer />
            </div>
        </>
    )
}