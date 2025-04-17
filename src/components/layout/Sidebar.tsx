import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Calendar,
  ClipboardList,
  Home,
  Settings,
  Users,
  X,
  FileText,
  LogOut,
  BarChart2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ScrollArea } from '@/components/ui/scroll-area';

type UserRole = 'staff' | 'manager' | 'admin' | 'employee';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const location = useLocation();
  const { userRole, handleLogout } = useAuth();

  const managerItems: NavItem[] = [
    {
      label: "Manager Dashboard",
      href: "/manager",
      icon: <Users className="h-5 w-5" />,
      roles: ['manager'] as UserRole[]
    },
  ];

  const adminItems: NavItem[] = [
    {
      label: "Admin Panel",
      href: "/admin",
      icon: <Settings className="h-5 w-5" />,
      roles: ['admin'] as UserRole[]
    },
    {
      label: "Reports",
      href: "/reports",
      icon: <BarChart2 className="h-5 w-5" />,
      roles: ['admin', 'manager'] as UserRole[]
    },
  ];

  const baseNavItems: NavItem[] = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
      roles: ['staff', 'manager', 'employee'] as UserRole[]
    },
    {
      label: "Leave Application",
      href: "/leave-application",
      icon: <FileText className="h-5 w-5" />,
      roles: ['staff', 'manager', 'employee'] as UserRole[]
    },
    {
      label: "Leave History",
      href: "/leave-history",
      icon: <Calendar className="h-5 w-5" />,
      roles: ['staff', 'manager', 'employee'] as UserRole[]
    },
    {
      label: "Calendar",
      href: "/calendar",
      icon: <Calendar className="h-5 w-5" />,
      roles: ['staff', 'manager', 'admin', 'employee'] as UserRole[]
    },
  ];

  const allItems = [
    ...baseNavItems,
    ...managerItems,
    ...adminItems,
  ].filter(item => item.roles.includes(userRole as UserRole)).sort((a, b) => a.label.localeCompare(b.label));

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-200",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={toggleSidebar}
      ></div>

      <aside
        className={cn(
          "fixed top-0 left-0 h-screen bg-sidebar w-64 shadow-lg z-50 transition-transform duration-300 transform md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full text-sidebar-foreground">
          <div className="p-4 flex justify-between items-center border-b border-sidebar-border">
            <Link to="/" className="flex items-center">
              <Calendar className="h-6 w-6 mr-2" />
              <span className="text-xl font-semibold">LeaveFlow</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-sidebar-foreground hover:text-white hover:bg-sidebar-accent"
              onClick={toggleSidebar}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-1 p-2">
                {allItems.map((item) => (
                  <Button
                    key={item.href}
                    variant={location.pathname === item.href ? 'secondary' : 'ghost'}
                    className={cn(
                      'w-full justify-start gap-2',
                      location.pathname === item.href && ' font-medium'
                    )}
                    asChild
                  >
                    <Link to={item.href}>
                      {item.icon}
                      {item.label}
                    </Link>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </nav>

          <div className="p-4 border-t border-sidebar-border">
            <div className="text-xs text-sidebar-foreground/70">
              LeaveFlow v1.0
            </div>
          </div>

          <div className="mt-auto p-2">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
