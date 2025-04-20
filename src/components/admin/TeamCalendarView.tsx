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
import { formatDateToApi } from "@/lib/utils";

// Mock data for team leaves
const mockLeaveRequests = [
  {
    id: "1",
    employee: "John Doe",
    type: "annual",
    startDate: new Date(2024, 2, 15),
    endDate: new Date(2024, 2, 20),
    status: "approved",
  },
  {
    id: "2",
    employee: "Jane Smith",
    type: "sick",
    startDate: new Date(2024, 2, 18),
    endDate: new Date(2024, 2, 19),
    status: "approved",
  },
  {
    id: "3",
    employee: "Mike Johnson",
    type: "personal",
    startDate: new Date(2024, 2, 22),
    endDate: new Date(2024, 2, 22),
    status: "pending",
  },
];


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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="success">Approved</Badge>;
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Team Calendar</h2>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={isLoadingLeaveApplications}
            className="rounded-md border border-gray-200"
            modifiers={{
              teamLeave: (date) => leaveApplications?.leave_applications?.some(leave => new Date(leave.startDate) <= date && new Date(leave.endDate) >= date),
            }}
            modifiersStyles={{

              teamLeave: {
                backgroundColor: "#e5f0f8",
                color: "#1e40af",
              },
            }}
          />
        </div>
        <div className="space-y-4">
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
                      <TableCell className="font-medium">{leave.employee.name}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs  ${getLeaveColor(leave.leaveType.toLocaleLowerCase())}`}>
                          {leave.leaveType.charAt(0).toUpperCase() + leave.leaveType.slice(1)}
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
    </div>
  );
};

export default TeamCalendarView;
