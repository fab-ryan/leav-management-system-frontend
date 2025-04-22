import { useState } from "react";
import { useGetAllLeaveApplicationsByStatusQuery, useUpdateLeaveApplicationByStatusMutation, useGetAllHolidaysQuery } from "@/features/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Clock, Download, Eye, Search, ChevronUpIcon, ChevronDownIcon, Filter, CalendarIcon, Loader2 } from "lucide-react";
import { formatDate, downloadExportLeaveApplications } from "@/lib/utils";
import LeaveRequestDetail from "./LeaveRequestDetail";
import { Card, CardContent } from "../ui/card";
import { toast } from "@/hooks/use-toast";
import { Input } from "../ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { LeaveStatus } from "@/types";
import { LeaveType } from "@/types";

const LeaveManagement = () => {
    const { data: holidays } = useGetAllHolidaysQuery()
    const [activeTab, setActiveTab] = useState("PENDING");
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [updateLeaveApplication, updateLeaveeApplicationStatus] = useUpdateLeaveApplicationByStatusMutation()
    const [querySelected, setQuerySelected] = useState<{
        status?: string
        type?: string
        startDate?: string
        endDate?: string
    } | null>(null);
    const [filterType, setFilterType] = useState<LeaveType | "all">("all");
    const [filterStatus, setFilterStatus] = useState<LeaveStatus | "all">("PENDING");
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortField, setSortField] = useState<string>("startDate");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
    const { data: leaveApplications, isLoading } = useGetAllLeaveApplicationsByStatusQuery({
        status: filterStatus,
        startDate: querySelected?.startDate,
        endDate: querySelected?.endDate,
        search: searchQuery.length > 2 ? searchQuery : undefined,
        page: currentPage,
        type: filterType !== "all" ? filterType : undefined,
        size: pageSize,
        sort: `${sortDirection}`,
    }, {
        refetchOnReconnect: false,
        refetchOnMountOrArgChange: true,
    });

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending":
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="mr-1 h-3 w-3" /> Pending</Badge>;
            case "approved":
                return <Badge variant="secondary" className="bg-green-100 text-green-800"><Check className="mr-1 h-3 w-3" /> Approved</Badge>;
            case "rejected":
                return <Badge variant="secondary" className="bg-red-100 text-red-800"><X className="mr-1 h-3 w-3" /> Rejected</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const handleExport = () => {
        if (leaveApplications?.leave_applications?.content?.length === 0) {
            toast({
                title: 'No leave applications found',
                description: 'Please filter the leave applications to export',
                variant: 'warning'
            })
            return
        }
        downloadExportLeaveApplications({
            status: filterStatus,
            startDate: querySelected?.startDate,
            endDate: querySelected?.endDate,
            search: searchQuery.length > 2 ? searchQuery : undefined,
            page: currentPage,
            type: filterType !== "all" ? filterType : undefined,
            size: pageSize,
            sort: `${sortDirection}`,

        })
    };

    const handleViewDetails = (request: any) => {
        setSelectedRequest(request);
        setIsDetailOpen(true);
    };

    const handleApprove = (id: string, comments: string) => {
        if (updateLeaveeApplicationStatus.isLoading) return

        updateLeaveApplication({
            id,
            status: 'APPROVED',
            comment: comments
        }).unwrap().then(() => {
            toast({
                title: 'Leave request approved successfully',
                description: 'The leave request has been approved successfully',
                variant: 'success'
            })
        })
    };
    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const handleReject = (id: string, comments: string) => {
        if (updateLeaveeApplicationStatus.isLoading) return

        updateLeaveApplication({
            id,
            status: 'REJECTED',
            comment: comments
        }).unwrap()
    };

    const totalPages = leaveApplications?.leave_applications?.totalPages || 1;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Leave Management</h2>
            </div>
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
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Export Leaves
                    </Button>
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
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="APPROVED">Approved</SelectItem>
                                <SelectItem value="REJECTED">Rejected</SelectItem>
                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
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




            <Card className="mt-4">
                <CardContent>

                    <LeaveTable
                        applications={leaveApplications?.leave_applications?.content || []}
                        isLoading={isLoading}
                        onViewDetails={handleViewDetails}
                        getStatusBadge={getStatusBadge}
                        filterStatus={filterStatus}
                        filterType={filterType}
                        querySelected={querySelected}
                        sortField={sortField}
                        sortDirection={sortDirection}
                        handleSort={handleSort}
                    />

                </CardContent>
            </Card>
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



            <LeaveRequestDetail
                request={selectedRequest}
                open={isDetailOpen}
                onOpenChange={setIsDetailOpen}
                onApprove={handleApprove}
                onReject={handleReject}
            />
        </div>
    );
};

interface LeaveTableProps {
    applications: any[];
    isLoading: boolean;
    onViewDetails: (request: any) => void;
    getStatusBadge: (status: string) => JSX.Element;
    filterStatus: LeaveStatus | "all";
    filterType: LeaveType | "all";
    querySelected: {
        status?: string;
        type?: string;
        startDate?: string;
        endDate?: string;
    } | null;
    sortField: string;
    sortDirection: "asc" | "desc";
    handleSort: (field: string) => void;
}

const LeaveTable = ({ applications, isLoading, onViewDetails, handleSort }: LeaveTableProps) => {
    if (isLoading) {
        return <div className="flex justify-center items-center h-64">
            <Loader2 className="h-4 w-4 animate-spin" />
        </div>;
    }


    const leaveTypeDisplay = (type: string) => {
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
    }

    return (
        <div className="">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead
                            className="cursor-pointer"
                            onClick={() => handleSort("employee")}
                        >
                            Employee
                        </TableHead>
                        <TableHead
                            className="cursor-pointer"
                            onClick={() => handleSort("leaveType")}
                        >
                            Leave Type
                        </TableHead>
                        <TableHead
                            className="cursor-pointer"
                            onClick={() => handleSort("startDate")}
                        >
                            From
                        </TableHead>
                        <TableHead
                            className="cursor-pointer"
                            onClick={() => handleSort("endDate")}
                        >
                            To
                        </TableHead>
                        <TableHead
                            className="cursor-pointer"
                            onClick={() => handleSort("createdAt")}
                        >
                            Requested On
                        </TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        applications.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">No leave applications found</TableCell>
                            </TableRow>
                        ) : (
                            applications.map((application) => (
                                <TableRow key={application.id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{application.employee.name}</div>
                                            <div className="text-sm text-gray-500">{application.employee.email}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{leaveTypeDisplay(application.leaveType.toLowerCase())}</TableCell>
                                    <TableCell>{formatDate(application.startDate)}</TableCell>
                                    <TableCell>{formatDate(application.endDate)}</TableCell>
                                    <TableCell>{formatDate(application.createdAt)}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onViewDetails(application)}
                                            >
                                                <Eye className="h-4 w-4 mr-1" />
                                                View
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )
                    }
                </TableBody>
            </Table>
        </div>
    );
};

export default LeaveManagement; 