import { useEffect, useState } from "react";
import { useGetCompassionateByAdminQuery, useUpdateCompassionateLeaveStatusMutation } from "@/features/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Clock, Download, Eye, Search, ChevronUpIcon, ChevronDownIcon, Filter, CalendarIcon, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import CompassionateLeaveDetailsCard from "@/components/leave/CompassionateLeaveDetailsCard";
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const CompassionateLeaveManagement = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [updateCompassionateLeave, updateCompassionateLeaveStatus] = useUpdateCompassionateLeaveStatusMutation();
    const [querySelected, setQuerySelected] = useState<{
        status?: string;
        startDate?: string;
        endDate?: string;
    } | null>(null);

    const [sortField, setSortField] = useState<string>("workDate");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

    const { data: compassionateLeaves, isLoading, refetch } = useGetCompassionateByAdminQuery();
    useEffect(() => {
        if (updateCompassionateLeaveStatus.isSuccess) {
            refetch();
        }
    }, [updateCompassionateLeaveStatus.isSuccess]);

    const handleApprove = (id: string, comments: string) => {
        if (updateCompassionateLeaveStatus.isLoading) return;

        updateCompassionateLeave({
            id,
            status: 'APPROVED',
            rejectionReason: comments
        }).unwrap().then(() => {
            toast({
                title: 'Compassionate leave request approved successfully',
                description: 'The compassionate leave request has been approved successfully',
                variant: 'success'
            });
            setIsDetailOpen(false);
        }).catch((error) => {
            toast({
                title: 'Failed to approve compassionate leave request',
                description: error?.data?.message || 'An error occurred while approving the request',
                variant: 'destructive'
            });
        });
    };

    const handleReject = (id: string, comments: string) => {
        if (updateCompassionateLeaveStatus.isLoading) return;

        updateCompassionateLeave({
            id,
            status: 'REJECTED',
            rejectionReason: comments
        }).unwrap().then(() => {
            toast({
                title: 'Compassionate leave request rejected successfully',
                description: 'The compassionate leave request has been rejected successfully',
                variant: 'success'
            });
            setIsDetailOpen(false);
        }).catch((error) => {
            toast({
                title: 'Failed to reject compassionate leave request',
                description: error?.data?.message || 'An error occurred while rejecting the request',
                variant: 'destructive'
            });
        });
    };

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const handleViewDetails = (request: any) => {
        setSelectedRequest(request);
        setIsDetailOpen(true);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        type="search"
                        placeholder="Search compassionate leave requests..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* <div className="flex gap-2">
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
                </div> */}
            </div>

            {showFilters && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md">
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
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            )}

            <Card>
                <CardContent className="p-0">


                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead
                                        className="cursor-pointer"
                                        onClick={() => handleSort("workDate")}
                                    >
                                        <div className="flex items-center gap-1">
                                            Date
                                            <ChevronUpIcon className="h-4 w-4" />
                                        </div>
                                    </TableHead>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead
                                        className="cursor-pointer"
                                        onClick={() => handleSort("status")}
                                    >
                                        <div className="flex items-center gap-1">
                                            Status
                                            <ChevronUpIcon className="h-4 w-4" />
                                        </div>
                                    </TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-6">
                                            <div className="flex items-center justify-center">
                                                <Loader2 className="h-6 w-6 animate-spin" />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : compassionateLeaves?.compassion_requests?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-6">
                                            No compassionate leave requests found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    compassionateLeaves?.compassion_requests?.map((leave) => (
                                        <TableRow key={leave.id}>
                                            <TableCell>{formatDate(leave.workDate)}</TableCell>
                                            <TableCell>{leave.employee.name}</TableCell>
                                            <TableCell className="max-w-xs truncate">
                                                {leave.reason}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        leave.status === "APPROVED"
                                                            ? "success"
                                                            : leave.status === "REJECTED"
                                                                ? "destructive"
                                                                : "default"
                                                    }
                                                    className="text-white"
                                                >
                                                    {leave.status}
                                                </Badge>
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
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Leave Details Dialog */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Compassionate Leave Details</DialogTitle>
                    </DialogHeader>
                    {selectedRequest && (
                        <CompassionateLeaveDetailsCard
                            request={selectedRequest}
                            onApprove={handleApprove}
                            onReject={handleReject}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CompassionateLeaveManagement; 