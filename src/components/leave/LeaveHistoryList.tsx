import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Filter,
  Search,
  Eye,
  Loader2,
  ArrowUpDown,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import { LeaveApplication, LeaveRequest, LeaveStatus, LeaveType } from "@/types";
import LeaveStatusBadge from "./LeaveStatusBadge";
import LeaveRequestDetailsCard from "./LeaveRequestDetailsCard";
import { useCancelLeaveApplicationMutation, useEmployeeApplicationsQuery, useGetAllHolidaysQuery } from "@/features/api";
import { Card, CardContent } from "../ui/card";

const LeaveHistoryList = () => {

  const { data: holidays } = useGetAllHolidaysQuery()
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<LeaveStatus | "all">("all");
  const [filterType, setFilterType] = useState<LeaveType | "all">("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState<string | null>(null);
  const [selectedLeaveRequest, setSelectedLeaveRequest] = useState<LeaveApplication | null>(null);
  const [cancelLeaveApplication, { isLoading: isCancelling, isSuccess: isCancelled }] = useCancelLeaveApplicationMutation()
  const [querySelected, setQuerySelected] = useState<{
    status?: string
    type?: string
    startDate?: string
    endDate?: string
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<string>("startDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const { data: leaveHistories, isLoading, refetch } = useEmployeeApplicationsQuery({
    status: filterStatus !== "all" ? filterStatus : undefined,
    type: filterType !== "all" ? filterType.toUpperCase() : undefined,
    startDate: querySelected?.startDate,
    endDate: querySelected?.endDate,
    search: searchQuery.length > 2 ? searchQuery : undefined,
    page: currentPage,
    size: pageSize,
    sort: `${sortDirection}`,
  }, {
    refetchOnReconnect: false,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isCancelling) return;
    if (isCancelled) {
      refetch();
    }
  }, [isCancelled,]);

  // Format date as DD MMM YYYY
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Calculate duration in days
  const calculateDuration = (start: Date, end: Date, isHalfDay: boolean) => {
    if (isHalfDay) return "0.5 day";

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  };

  // Get leave type display name
  const getLeaveTypeDisplay = (type: LeaveType) => {
    switch (type) {
      case "annual":
        return "Annual Leave";
      case "sick":
        return "Sick Leave";
      case "personal":
        return "Personal Leave";
      case "maternity":
        return "Maternity Leave";
      case "paternity":
        return "Paternity Leave";
      case "unpaid":
        return "Unpaid Leave";
      case "other":
        return "Other";
      default:
        return type;
    }
  };



  const handleCancelRequest = () => {
    if (!selectedLeaveId) return;
    if (isCancelling) return;
    setShowCancelDialog(false);
    cancelLeaveApplication({ id: selectedLeaveId }).unwrap().then((res) => {
      toast({
        title: "Leave request cancelled",
        description: res.message,
      });

    }).catch((err) => {
      toast({
        title: "Error cancelling leave request",
        description: err.data.message,
      });
    });
    setShowCancelDialog(false);

  };

  // Handle view details
  const handleViewDetails = (leaveRequest: LeaveApplication) => {
    setSelectedLeaveRequest(leaveRequest);
    setShowDetailsDialog(true);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const totalPages = leaveHistories?.leave_applications?.totalPages || 1;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search leave requests..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex gap-2 items-center"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            Filters
            {showFilters ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-md">
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={filterStatus}
              onValueChange={(value) => setFilterStatus(value as LeaveStatus | "all")}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Leave Type</label>
            <Select
              value={filterType}
              onValueChange={(value) => setFilterType(value as LeaveType | "all")}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="annual">Annual Leave</SelectItem>
                <SelectItem value="sick">Sick Leave</SelectItem>
                <SelectItem value="personal">Personal Leave</SelectItem>
                <SelectItem value="maternity">Maternity Leave</SelectItem>
                <SelectItem value="paternity">Paternity Leave</SelectItem>
                <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Date Range</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between text-left font-normal"
                >
                  <span className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {querySelected?.startDate && querySelected?.endDate
                      ? `${querySelected.startDate} - ${querySelected.endDate}`
                      : "Select Date Range"}
                  </span>
                  <ChevronDownIcon className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={{
                    from: querySelected?.startDate
                      ? new Date(querySelected.startDate)
                      : undefined,
                    to: querySelected?.endDate
                      ? new Date(querySelected.endDate)
                      : undefined,
                  }}
                  onSelect={(range) => {
                    setQuerySelected({
                      startDate: range?.from
                        ? range.from.toISOString().split("T")[0]
                        : undefined,
                      endDate: range?.to
                        ? range.to.toISOString().split("T")[0]
                        : undefined,
                    });
                  }}
                  modifiers={{
                    holidays: holidays?.holidays?.map((holiday) => new Date(holiday.date))
                  }}
                  modifiersClassNames={{
                    holidays: "bg-red-500 text-white",
                  }}
                  disabled={(date) => {
                    const today = new Date();
                    return date < today;
                  }}
                  initialFocus
                  className="p-3 pointer-events-auto"
                  components={{
                    DayContent: ({ date }) => {
                      const holiday = holidays?.holidays?.find(
                        (h) => new Date(h.date).toDateString() === date.toDateString()
                      );
                      return (
                        <div className="relative group">
                          {date.getDate()}
                          {holiday && (
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                              {holiday.name}
                            </div>
                          )}
                        </div>
                      );
                    },
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <Card>
          <CardContent>


            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("leaveType")}
                  >
                    <div className="flex items-center gap-1">
                      Leave Type
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("startDate")}
                  >
                    <div className="flex items-center gap-1">
                      Date Range
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                  isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                        <div className="flex items-center justify-center p-4">
                          <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : null
                }
                {leaveHistories?.leave_applications?.content?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                      No leave requests found
                    </TableCell>
                  </TableRow>
                ) : (
                  leaveHistories?.leave_applications?.content?.map((leave) => (
                    <TableRow key={leave.id}>
                      <TableCell className="font-medium">
                        {getLeaveTypeDisplay(leave?.leaveType?.toLowerCase() as LeaveType)}
                      </TableCell>
                      <TableCell>
                        {calculateDuration(new Date(leave.startDate), new Date(leave.endDate), leave.isHalfDay)}
                        {leave.isHalfDay && (
                          <span className="text-xs text-gray-500 block">
                            {leave.isMorning ? "Morning" : "Afternoon"}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {formatDate(new Date(leave.startDate))}
                        {!leave.isHalfDay && new Date(leave.startDate).getTime() !== new Date(leave.endDate).getTime() &&
                          ` - ${formatDate(new Date(leave.endDate))}`
                        }
                      </TableCell>
                      <TableCell>
                        <LeaveStatusBadge status={leave.status.toLowerCase() as LeaveStatus} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleViewDetails(leave)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {leave.status.toLowerCase() === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedLeaveId(leave.id);
                                setShowCancelDialog(true);
                              }}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-gray-700">
            Page {currentPage + 1} of {totalPages}
          </p>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(Number(value));
              setCurrentPage(0);
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage + 1 === totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Leave Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this leave request? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, keep request</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelRequest} className="bg-red-500 hover:bg-red-600">
              Yes, cancel request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Leave Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Leave Request Details</DialogTitle>
          </DialogHeader>
          {selectedLeaveRequest && (
            <LeaveRequestDetailsCard
              request={selectedLeaveRequest}
              onCancel={(id) => {
                setSelectedLeaveId(id);
                setShowDetailsDialog(false);
                setShowCancelDialog(true);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeaveHistoryList;
