
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarCheck, CalendarClock, ClipboardCheck, LayoutDashboard, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <CalendarCheck className="h-6 w-6 text-primary mr-2" />
            <span className="text-xl font-semibold text-primary">IST Africa</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="outline">Log in</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-white py-16 px-6 flex-1">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Simplify Leave Management for Your Organization
              </h1>
              <p className="text-lg text-gray-600">
                IST Africa makes it easy to request, track, and manage employee leave. Streamline your
                workflow and keep your team organized.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <img
                src="/placeholder.svg"
                alt="IST Africa Dashboard"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Features Designed for Efficiency
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform provides all the tools you need to manage employee leave effectively
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <LayoutDashboard className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Intuitive Dashboard</h3>
              <p className="text-gray-600">
                Get a clear overview of leave balances, upcoming holidays, and pending requests.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <ClipboardCheck className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Simple Leave Requests</h3>
              <p className="text-gray-600">
                Submit and track leave applications with an easy-to-use form and approval workflow.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <CalendarClock className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Team Calendar</h3>
              <p className="text-gray-600">
                Visualize team availability with a shared calendar showing holidays and approved leaves.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Role-Based Access</h3>
              <p className="text-gray-600">
                Different interfaces for employees, managers, and administrators with appropriate permissions.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-secondary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Notifications</h3>
              <p className="text-gray-600">
                Automated alerts for pending approvals, upcoming leaves, and balance updates.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-secondary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Microsoft Integration</h3>
              <p className="text-gray-600">
                Seamless authentication with Microsoft and optional calendar synchronization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-primary/5">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Streamline Your Leave Management?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Join organizations that use IST Africa to simplify their HR processes
          </p>
          <Link to="/login">
            <Button size="lg">Get Started Now</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <CalendarCheck className="h-6 w-6 text-primary mr-2" />
              <span className="text-xl font-semibold text-primary">IST Africa</span>
            </div>
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} IST Africa. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
