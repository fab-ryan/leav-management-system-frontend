
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Holiday, LeaveRequest } from "@/types";

const LeaveCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<"team" | "department" | "all">("team");

  // Mock data
  const holidays: Holiday[] = [
    {
      id: "1",
      name: "New Year's Day",
      date: new Date(2025, 0, 1),
      isRestricted: true,
    },
    {
      id: "2",
      name: "Memorial Day",
      date: new Date(2025, 4, 26),
      isRestricted: true,
    },
    {
      id: "3",
      name: "Independence Day",
      date: new Date(2025, 6, 4),
      isRestricted: true,
    },
    {
      id: "4",
      name: "Labor Day",
      date: new Date(2025, 8, 1),
      isRestricted: true,
    },
    {
      id: "5",
      name: "Thanksgiving Day",
      date: new Date(2025, 10, 27),
      isRestricted: true,
    },
    {
      id: "6",
      name: "Christmas Day",
      date: new Date(2025, 11, 25),
      isRestricted: true,
    },
  ];

  const teamLeaves: LeaveRequest[] = [
    {
      id: "1",
      userId: "user2",
      type: "annual",
      status: "approved",
      startDate: new Date(2025, 3, 15),
      endDate: new Date(2025, 3, 20),
      isHalfDay: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      userId: "user3",
      type: "sick",
      status: "approved",
      startDate: new Date(2025, 3, 22),
      endDate: new Date(2025, 3, 23),
      isHalfDay: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // Helper function to check if date is a holiday
  const isHoliday = (date: Date) => {
    return holidays.some(
      (holiday) => holiday.date.toDateString() === date.toDateString()
    );
  };

  // Helper function to check if date has a team leave
  const hasTeamLeave = (date: Date) => {
    return teamLeaves.some(
      (leave) =>
        date >= new Date(leave.startDate.setHours(0, 0, 0, 0)) &&
        date <= new Date(leave.endDate.setHours(23, 59, 59, 999))
    );
  };

  // Get selected date details (holidays and team members on leave)
  const getSelectedDateDetails = (date: Date | undefined) => {
    if (!date) return { holidays: [], leaves: [] };

    const dateHolidays = holidays.filter(
      (holiday) => holiday.date.toDateString() === date.toDateString()
    );

    const dateLeaves = teamLeaves.filter(
      (leave) =>
        date >= new Date(leave.startDate.setHours(0, 0, 0, 0)) &&
        date <= new Date(leave.endDate.setHours(23, 59, 59, 999))
    );

    return { holidays: dateHolidays, leaves: dateLeaves };
  };

  const selectedDateDetails = getSelectedDateDetails(date);
  
  // Format date as Mon, DD MMM YYYY
  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Team members on leave for the selected month
  const teamMembersOnLeave = teamLeaves.filter(
    (leave) =>
      (date?.getMonth() === leave.startDate.getMonth() &&
        date?.getFullYear() === leave.startDate.getFullYear()) ||
      (date?.getMonth() === leave.endDate.getMonth() &&
        date?.getFullYear() === leave.endDate.getFullYear())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Team Calendar</CardTitle>
                <Select
                  value={viewMode}
                  onValueChange={(v) => setViewMode(v as "team" | "department" | "all")}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="View mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="team">My Team</SelectItem>
                    <SelectItem value="department">Department</SelectItem>
                    <SelectItem value="all">All Employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border p-3 pointer-events-auto"
                modifiers={{
                  holiday: (date) => isHoliday(date),
                  teamLeave: (date) => hasTeamLeave(date),
                }}
                modifiersStyles={{
                  holiday: {
                    backgroundColor: "#f8e5e5",
                    color: "#b91c1c",
                    fontWeight: "bold",
                  },
                  teamLeave: {
                    backgroundColor: "#e5f0f8",
                    color: "#1e40af",
                  },
                }}
              />
              <div className="mt-4 flex gap-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-[#f8e5e5] mr-2"></div>
                  <span className="text-sm">Holiday</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-[#e5f0f8] mr-2"></div>
                  <span className="text-sm">Team Leave</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-1/2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>{formatDate(date)}</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateDetails.holidays.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Holidays</h3>
                  <ul className="space-y-2">
                    {selectedDateDetails.holidays.map((holiday) => (
                      <li
                        key={holiday.id}
                        className="flex items-center justify-between bg-red-50 p-3 rounded-md"
                      >
                        <span>{holiday.name}</span>
                        <Badge variant="outline" className="bg-red-100 text-red-800">
                          Holiday
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h3 className="text-lg font-medium mb-2">Team Members on Leave</h3>
                {selectedDateDetails.leaves.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedDateDetails.leaves.map((leave) => (
                      <li
                        key={leave.id}
                        className="flex items-center justify-between bg-blue-50 p-3 rounded-md"
                      >
                        <div>
                          <p className="font-medium">
                            {leave.userId === "user2" ? "Jane Smith" : "Mike Johnson"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {leave.type === "annual" ? "Annual Leave" : "Sick Leave"}
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-blue-100 text-blue-800">
                          {leave.isHalfDay ? "Half Day" : "Full Day"}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No team members on leave for this date</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Leaves</CardTitle>
        </CardHeader>
        <CardContent>
          {teamMembersOnLeave.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembersOnLeave.map((leave) => (
                  <TableRow key={leave.id}>
                    <TableCell>
                      {leave.userId === "user2" ? "Jane Smith" : "Mike Johnson"}
                    </TableCell>
                    <TableCell>
                      {leave.type === "annual" ? "Annual Leave" : "Sick Leave"}
                    </TableCell>
                    <TableCell>
                      {`${leave.startDate.toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                      })} - ${leave.endDate.toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                      })}`}
                    </TableCell>
                    <TableCell>
                      {Math.ceil(
                        (leave.endDate.getTime() - leave.startDate.getTime()) /
                          (1000 * 60 * 60 * 24)
                      ) + 1}{" "}
                      days
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-500 italic">No upcoming leave for the selected month</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveCalendar;
