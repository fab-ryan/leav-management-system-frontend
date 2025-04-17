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

// Mock data for departments
const departments = [
  { id: "1", name: "Engineering" },
  { id: "2", name: "Design" },
  { id: "3", name: "Marketing" },
  { id: "4", name: "HR" },
];

const TeamCalendarView = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);

  // Function to get leaves for a specific date
  const getLeavesForDate = (date: Date) => {
    return mockLeaveRequests.filter(leave => {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      return date >= start && date <= end;
    });
  };

  // Function to get the color for a leave type
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

  // Function to get the status badge
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
              {departments.map(dept => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            {date ? format(date, "MMMM d, yyyy") : "Select a date"}
          </h3>
          <div className="space-y-2">
            {isLoading ? (
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
                  {getLeavesForDate(date).map(leave => (
                    <TableRow key={leave.id}>
                      <TableCell className="font-medium">{leave.employee}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getLeaveColor(leave.type)}`}>
                          {leave.type.charAt(0).toUpperCase() + leave.type.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(leave.status)}</TableCell>
                    </TableRow>
                  ))}
                  {getLeavesForDate(date).length === 0 && (
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
