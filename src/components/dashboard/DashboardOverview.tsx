
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, FileCheck, UserCheck } from "lucide-react";
import { LeaveBalanceCard } from "./LeaveBalanceCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const DashboardOverview = () => {
  // Mock data - would come from API
  const pendingRequests = 1;
  const approvedRequests = 5;
  const upcomingLeave = {
    type: "Annual Leave",
    startDate: new Date(2025, 3, 20),
    endDate: new Date(2025, 3, 25)
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <LeaveBalanceCard />
        
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Frequently used actions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/leave-application">
              <Button className="w-full justify-start">
                <FileCheck className="mr-2 h-4 w-4" />
                Apply for Leave
              </Button>
            </Link>
            <Link to="/calendar">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                View Calendar
              </Button>
            </Link>
            <Link to="/leave-history">
              <Button variant="outline" className="w-full justify-start">
                <Clock className="mr-2 h-4 w-4" />
                View Leave History
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Requests
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval from your manager
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Approved Leaves
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedRequests}</div>
            <p className="text-xs text-muted-foreground">
              Total approved requests this year
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Leave
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {upcomingLeave ? (
              <>
                <div className="text-lg font-bold">{upcomingLeave.type}</div>
                <p className="text-xs text-muted-foreground">
                  {formatDate(upcomingLeave.startDate)} - {formatDate(upcomingLeave.endDate)}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No upcoming leave scheduled</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
