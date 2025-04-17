
import { useState } from "react";
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
import { toast } from "@/hooks/use-toast";
import { LeaveRequest, LeaveStatus, LeaveType } from "@/types";
import LeaveStatusBadge from "./LeaveStatusBadge";
import LeaveRequestDetailsCard from "./LeaveRequestDetailsCard";

const LeaveHistoryList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<LeaveStatus | "all">("all");
  const [filterType, setFilterType] = useState<LeaveType | "all">("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState<string | null>(null);
  const [selectedLeaveRequest, setSelectedLeaveRequest] = useState<LeaveRequest | null>(null);

  // Mock data
  const mockLeaveHistory: LeaveRequest[] = [
    {
      id: "1",
      userId: "user1",
      type: "annual",
      status: "approved",
      startDate: new Date(2025, 3, 20),
      endDate: new Date(2025, 3, 25),
      isHalfDay: false,
      reason: "Family vacation",
      createdAt: new Date(2025, 3, 1),
      updatedAt: new Date(2025, 3, 2),
    },
    {
      id: "2",
      userId: "user1",
      type: "sick",
      status: "approved",
      startDate: new Date(2025, 2, 15),
      endDate: new Date(2025, 2, 16),
      isHalfDay: false,
      reason: "Fever",
      documentUrls: ["document1.pdf"],
      createdAt: new Date(2025, 2, 14),
      updatedAt: new Date(2025, 2, 14),
    },
    {
      id: "3",
      userId: "user1",
      type: "personal",
      status: "rejected",
      startDate: new Date(2025, 1, 5),
      endDate: new Date(2025, 1, 5),
      isHalfDay: true,
      isMorning: true,
      reason: "Personal appointment",
      comments: "Insufficient team coverage on this date",
      createdAt: new Date(2025, 1, 1),
      updatedAt: new Date(2025, 1, 2),
    },
    {
      id: "4",
      userId: "user1",
      type: "annual",
      status: "pending",
      startDate: new Date(2025, 5, 10),
      endDate: new Date(2025, 5, 15),
      isHalfDay: false,
      reason: "Summer vacation",
      createdAt: new Date(2025, 4, 25),
      updatedAt: new Date(2025, 4, 25),
    },
  ];

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

  // Apply filters
  const filteredLeaveHistory = mockLeaveHistory.filter((leave) => {
    // Apply status filter
    if (filterStatus !== "all" && leave.status !== filterStatus) {
      return false;
    }
    
    // Apply type filter
    if (filterType !== "all" && leave.type !== filterType) {
      return false;
    }
    
    // Apply search query (search in type, status, and dates)
    if (searchQuery) {
      const leaveTypeDisplay = getLeaveTypeDisplay(leave.type).toLowerCase();
      const leaveStatus = leave.status.toLowerCase();
      const startDateStr = formatDate(leave.startDate).toLowerCase();
      const endDateStr = formatDate(leave.endDate).toLowerCase();
      const query = searchQuery.toLowerCase();
      
      return (
        leaveTypeDisplay.includes(query) ||
        leaveStatus.includes(query) ||
        startDateStr.includes(query) ||
        endDateStr.includes(query)
      );
    }
    
    return true;
  });

  // Handle cancel leave request
  const handleCancelRequest = () => {
    console.log(`Cancelling leave request: ${selectedLeaveId}`);
    
    // Show success toast
    toast({
      title: "Leave request cancelled",
      description: "Your leave request has been successfully cancelled",
    });
    
    setShowCancelDialog(false);
    // In a real app, this would call an API to cancel the request
  };

  // Handle view details
  const handleViewDetails = (leaveRequest: LeaveRequest) => {
    setSelectedLeaveRequest(leaveRequest);
    setShowDetailsDialog(true);
  };

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
            <Button variant="outline" className="w-full justify-between text-left font-normal">
              <span className="flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Date Range
              </span>
              <ChevronDownIcon className="h-4 w-4 opacity-50" />
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Leave Type</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Date Range</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeaveHistory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                  No leave requests found
                </TableCell>
              </TableRow>
            ) : (
              filteredLeaveHistory.map((leave) => (
                <TableRow key={leave.id}>
                  <TableCell className="font-medium">
                    {getLeaveTypeDisplay(leave.type)}
                  </TableCell>
                  <TableCell>
                    {calculateDuration(leave.startDate, leave.endDate, leave.isHalfDay)}
                    {leave.isHalfDay && (
                      <span className="text-xs text-gray-500 block">
                        {leave.isMorning ? "Morning" : "Afternoon"}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {formatDate(leave.startDate)} 
                    {!leave.isHalfDay && leave.startDate.getTime() !== leave.endDate.getTime() && 
                      ` - ${formatDate(leave.endDate)}`
                    }
                  </TableCell>
                  <TableCell>
                    <LeaveStatusBadge status={leave.status} />
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
                      {leave.status === "pending" && (
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
