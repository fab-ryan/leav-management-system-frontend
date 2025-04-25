import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LeaveRequest } from "@/types";
import UserAvatar from "@/components/ui/UserAvatar";
import { useGetAllDepartmentsQuery, useGetLeaveApplicationByDateQuery } from "@/features/api";
import { formatDate, formatDateToApi } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";




const TeamCalendarView = () => {
  const { data: departments } = useGetAllDepartmentsQuery()
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");

  const { data: leaveApplications, isLoading: isLoadingLeaveApplications } = useGetLeaveApplicationByDateQuery({
    date: formatDateToApi(date?.toISOString()),
    department: selectedDepartment === "all" ? null : selectedDepartment
  }, {
    skip: !date,
    refetchOnMountOrArgChange: true,

  })
  const { data: onLeaveApplications } = useGetLeaveApplicationByDateQuery({
    date: formatDateToApi(new Date().toISOString()),
    department: selectedDepartment === "all" ? null : selectedDepartment
  }, {
    refetchOnMountOrArgChange: true,
  })




  const getLeaveColor = (type: string) => {
    switch (type) {
      case "annual":
        return "bg-blue-100 text-blue-800";
      case "sick":
        return "bg-red-100 text-red-800";
      case "personal":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="success" className="text-white">Approved</Badge>;
      case "pending":
        return <Badge variant="warning" className="text-white">Pending</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="text-white">Rejected</Badge>;
      default:
        return <Badge variant="outline" className="text-white">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Organization Calendar</h2>
        <div className="flex gap-4">
          <Select
            value={selectedDepartment}
            onValueChange={setSelectedDepartment}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments?.departments?.map(dept => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Organization Calendar</CardTitle>
        </CardHeader>
        <CardContent>



          <div className="grid grid-cols-1 md:grid-cols-1 xs:grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-2">
            <div className="md:col-span-1">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => isLoadingLeaveApplications || isWeekend(date)}
                className="rounded-md border border-gray-200 "
                modifiers={{
                  weekend: (date) => isWeekend(date),
                  teamLeave: (date) => onLeaveApplications?.leave_applications?.some(leave => new Date(leave.startDate) <= date && new Date(leave.endDate) >= date),
                }}
                modifiersStyles={{

                  teamLeave: {
                    backgroundColor: "#e5f0f8",
                    color: "#1e40af",
                  },
                  weekend: {
                    backgroundColor: "#f8e5e5",
                    color: "#b91c1c",
                  },
                }}

              />
              <div className="mt-4 flex gap-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-[#f8e5e5] mr-2"></div>
                  <span className="text-sm">Holiday</span>
                </div>


                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full bg-[#e5f0f8]
                         mr-2`}></div>
                  <span className="text-sm">Leaves</span>
                </div>
              </div>
            </div>
            <div className="space-y-4 md:col-span-1">
              <h3 className="text-lg font-medium">
                {date ? format(date, "MMMM d, yyyy") : "Select a date"}
              </h3>
              <div className="space-y-2">
                {isLoadingLeaveApplications ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : date ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaveApplications?.leave_applications?.map((leave, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            <div className="flex items-start  flex-col">

                              {leave.employee.name}
                              <span className="text-sm text-gray-400">
                                {leave.employee.email}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="flex items-center justify-center gap-2 flex-col">
                            <span className={`px-2 py-1 rounded-full text-xs   ${getLeaveColor(leave.leaveType.toLocaleLowerCase())}`}>
                              {leave.leaveType.charAt(0).toUpperCase() + leave.leaveType.slice(1)}
                            </span>

                            <span className="text-sm text-gray-400 ">
                              <Badge variant="outline" className="bg-blue-100 text-blue-800 text-xs text-nowrap">
                                {
                                  formatDate(leave.startDate) + " - " + formatDate(leave.endDate)
                                }
                              </Badge>
                            </span>
                          </TableCell>
                          <TableCell>{getStatusBadge(leave.status.toLocaleLowerCase())}</TableCell>
                        </TableRow>
                      ))}
                      {leaveApplications?.leave_applications?.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-muted-foreground">
                            No leaves scheduled for this date
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Please select a date to view leaves
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamCalendarView;
