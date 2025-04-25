
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
import { useGetAllHolidaysQuery, useGetAllLeaveApplicationsByStatusQuery, useGetLeaveApplicationByDateQuery } from "@/features/api";
import { formatDate, formatDateToApi, leaveTypeDisplay } from "@/lib/utils";

const LeaveCalendar = () => {
  const { data: approvedLeavesData } = useGetAllLeaveApplicationsByStatusQuery({
    status: "approved".toLocaleUpperCase(),
  })

  const { data: holidaysData } = useGetAllHolidaysQuery()
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<"department" | "all">("department");
  const { data: leaveApplicationByDate } = useGetLeaveApplicationByDateQuery({
    date: formatDateToApi(date?.toISOString()),
    department: viewMode === "department" ? "department" : null
  },
    {
      skip: !date,
      refetchOnMountOrArgChange: true,
    })
  const { data: leaveApplications, isLoading: isLoadingLeaveApplications } = useGetLeaveApplicationByDateQuery({
    date: formatDateToApi(new Date().toISOString()),
    department: viewMode === "all" ? null : "department"
  }, {
    refetchOnMountOrArgChange: true,

  })

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };


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
                  onValueChange={(v) => setViewMode(v as "department" | "all")}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="View mode" />
                  </SelectTrigger>
                  <SelectContent>
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
                  holiday: holidaysData?.holidays?.map((holiday) => new Date(holiday.date)),
                  teamLeave: (date) => leaveApplications?.leave_applications?.some(leave => new Date(leave.startDate) <= date && new Date(leave.endDate) >= date),
                  weekend: (date) => isWeekend(date),
                }}
                disabled={(date) => {
                  if (isWeekend(date)) {
                    return true;
                  }
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
                  weekend: {
                    backgroundColor: "#f8e5e5",
                    color: "#b91c1b",
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
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-1/2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>{formatDate(date?.toISOString() || "")}</CardTitle>
            </CardHeader>
            <CardContent>
              {holidaysData?.holidays?.length > 0 &&
                holidaysData?.holidays?.filter((holiday) => formatDateToApi(date?.toISOString()) === holiday.date).length > 0 &&
                (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Holidays</h3>
                    <ul className="space-y-2">
                      {holidaysData?.holidays
                        ?.filter((holiday) => formatDateToApi(date?.toISOString()) === holiday.date)
                        ?.map((holiday) => (
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
                {leaveApplicationByDate?.leave_applications?.length > 0 ? (
                  <ul className="space-y-2">
                    {leaveApplicationByDate?.leave_applications?.map((leave) => (
                      <li
                        key={leave.id}
                        className="flex items-center justify-between bg-blue-50 p-3 rounded-md"
                      >
                        <div>
                          <p className="font-medium">
                            {leave.employee.name} <span className="text-xs text-gray-400">({leave.employee.email} / {leave.employee.role.toLocaleLowerCase()})</span>
                          </p>
                          <p className="text-sm text-gray-600">
                            {leaveTypeDisplay(leave.leaveType)} {leave.isHalfDay && leave.isMorning ? "Morning" : leave.isHalfDay && !leave.isMorning ? "Afternoon" : ""}
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 text-xs text-nowrap ">
                          {
                            formatDate(leave.startDate) + " - " + formatDate(leave.endDate)
                          }
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
          {approvedLeavesData?.leave_applications?.content?.length > 0 ? (
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
                {approvedLeavesData?.leave_applications?.content?.slice(0, 5).map((leave) => (
                  <TableRow key={leave.id}>
                    <TableCell>
                      {leave.employee.name}
                    </TableCell>
                    <TableCell>
                      {leaveTypeDisplay(leave.leaveType,)}
                    </TableCell>
                    <TableCell>
                      {`${formatDate(leave.startDate)} - ${formatDate(leave.endDate)}`}
                    </TableCell>
                    <TableCell>
                      {Math.ceil(
                        (new Date(leave.endDate).getTime() - new Date(leave.startDate).getTime()) /
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
