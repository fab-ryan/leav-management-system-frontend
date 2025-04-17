
import { Bell, Calendar, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import UserAvatar from "../ui/UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

const Header = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const [notifications] = useState([
    { id: 1, title: "Leave request approved", read: false },
    { id: 2, title: "New company policy update", read: false },
    { id: 3, title: "Upcoming holiday: New Year", read: true },
  ]);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white border-b border-gray-200 py-3 px-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden mr-2"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Link to="/" className="flex items-center">
          <Calendar className="h-6 w-6 text-primary mr-2" />
          <span className="text-xl font-semibold text-primary">LeaveFlow</span>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-accent text-white">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Notifications</h3>
              <Button variant="ghost" size="sm">
                Mark all as read
              </Button>
            </div>
            <div className="space-y-2 max-h-[300px] overflow-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-2 rounded text-sm ${
                    !notification.read
                      ? "bg-blue-50 font-medium"
                      : "bg-gray-50"
                  }`}
                >
                  {notification.title}
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full"
            >
              <UserAvatar
                name="John Doe"
                imageUrl="/placeholder.svg"
                size="sm"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to="/profile" className="w-full">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="/settings" className="w-full">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
