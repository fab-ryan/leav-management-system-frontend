import { Bell, Calendar, Loader2, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
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
import {
  useCountUnreadNotificationsQuery, useGetNotificationsQuery, useMarkNotificationAsReadMutation, useGetUnreadNotificationsQuery,
  useMarkAllNotificationsAsReadMutation
} from "@/features/api";
import { NotificationDetails } from "../notifications/NotificationDetails";
import { Notification } from "@/types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun } from "lucide-react";

const Header = ({ toggleSidebar }: { toggleSidebar: () => void }) => {

  const navigate = useNavigate();
  const { handleLogout } = useAuth();
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const { theme, setTheme } = useTheme();

  const { data: notifications, refetch: refetchNotifications } = useGetNotificationsQuery();
  const { data: unreadNotifications, refetch: refetchUnreadNotifications } = useGetUnreadNotificationsQuery();
  const { data: unreadCount, refetch: refetchUnreadCount } = useCountUnreadNotificationsQuery();
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation();
  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    if (unreadNotifications?.notifications?.some(n => n.id === notification.id)) {
      markAsRead(notification.id);
    }
  };
  useEffect(() => {
    refetchNotifications();
    refetchUnreadNotifications();
    refetchUnreadCount();
  }, [refetchNotifications, refetchUnreadNotifications, refetchUnreadCount, navigate]);
  const handleMarkAllAsRead = () => {
    if (unreadCount?.count > 0) {
      markAllAsRead();
    }
  };

  const handleLogoutDefault = () => {
    setIsLoggedOut(true);
    setTimeout(() => {
      localStorage.clear();
      navigate('/login', {


      });
      setIsLoggedOut(false);
      handleLogout();
    }, 1000);
  }
  if (isLoggedOut) {
    return (
      <div className="flex h-screen w-full items-center justify-center fixed inset-0 z-40 bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <header className="bg-background border-b border-border py-3 px-4 flex items-center justify-between sticky top-0 z-30">
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
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount?.count > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-accent text-accent-foreground">
                  {unreadCount?.count}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Notifications</h3>
              <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
                Mark all as read
              </Button>
            </div>
            <div className="space-y-2 max-h-[300px] overflow-auto">
              {notifications?.notifications?.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-2 rounded cursor-pointer hover:bg-accent ${unreadNotifications?.notifications?.some(n => n.id === notification.id)
                      ? "bg-accent/50"
                      : ""
                    }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{notification.title}</h4>
                    <span className="text-xs text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {notification.message}
                  </p>
                </div>
              ))}
              {unreadNotifications?.notifications?.length === 0 && (
                <div className="text-center text-muted-foreground py-4">
                  No new notifications
                </div>
              )}
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
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogoutDefault}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <NotificationDetails
        notification={selectedNotification}
        isOpen={!!selectedNotification}
        onClose={() => setSelectedNotification(null)}
      />
    </header>
  );
};

export default Header;
