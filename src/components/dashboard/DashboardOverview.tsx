
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, FileCheck, UserCheck } from "lucide-react";
import { LeaveBalanceCard } from "./LeaveBalanceCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useGetEmployeeDashboardQuery } from "@/features/api";

const DashboardOverview = () => {

  const { data: employeeData } = useGetEmployeeDashboardQuery()
  const pendingRequests = employeeData?.dashboard?.pendingLeavesCount || 0;
  const approvedRequests = employeeData?.dashboard?.approvedLeavesCount || 0;
  const upcomingLeave = {
    type: employeeData?.dashboard?.upcomingLeaves[0]?.leaveType || "Annual Leave",
    startDate: new Date(employeeData?.dashboard?.upcomingLeaves[0]?.startDate || new Date()),
    endDate: new Date(employeeData?.dashboard?.upcomingLeaves[0]?.endDate || new Date())
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
