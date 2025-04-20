import {
    Card,
    CardContent,

} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import { LeaveApplication } from "@/types";
import LeaveRequestDetail from "./LeaveRequestDetail";
import { useState } from "react";
import { useGetAllLeaveApplicationsByStatusQuery, useUpdateLeaveApplicationByStatusMutation } from "@/features/api";
import { toast } from "sonner";

export const ApprovalManager = () => {
    const { data: pendingLeavesData } = useGetAllLeaveApplicationsByStatusQuery({
        status: "pending".toLocaleUpperCase(),
    })
    const [updateLeaveApplication, updateLeaveeApplicationStatus] = useUpdateLeaveApplicationByStatusMutation()
    const [selectedRequest, setSelectedRequest] = useState<LeaveApplication | null>(null);
    const [requestDetailOpen, setRequestDetailOpen] = useState(false);


    const openRequestDetail = (request: LeaveApplication) => {
        setSelectedRequest(request);
        setRequestDetailOpen(true);
    };


    // Approve leave request
    const handleApproveRequest = (id: string, comments: string) => {
        if (updateLeaveeApplicationStatus.isLoading) return

        updateLeaveApplication({
            id,
            status: 'APPROVED',
            comment: comments
        }).unwrap().then(() => {
            toast.success('Leave request approved successfully')
        })

    };

    // Reject leave request
    const handleRejectRequest = (id: string, comments: string) => {
        if (updateLeaveeApplicationStatus.isLoading) return

        updateLeaveApplication({
            id,
            status: 'REJECTED',
            comment: comments
        }).unwrap()
    };
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
    const formatDate = (date: string) => new Date(date).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    return (<div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Pending Approvals</h2>
        </div>

        <Card>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Employee</TableHead>
                            <TableHead>Leave Type</TableHead>
                            <TableHead>From</TableHead>
                            <TableHead>To</TableHead>
                            <TableHead>Requested On</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pendingLeavesData?.leave_applications?.length > 0 ? (
                            pendingLeavesData?.leave_applications?.map((request, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{request.employee?.name}</TableCell>
                                    <TableCell>
                                        {leaveTypeDisplay(request.leaveType.toLowerCase())}
                                    </TableCell>
                                    <TableCell>
                                        {formatDate(request?.startDate)}
                                    </TableCell>
                                    <TableCell>
                                        {formatDate(request?.endDate)}
                                    </TableCell>
                                    <TableCell>
                                        {formatDate(request?.createdAt)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="bg-gray-100 hover:bg-gray-200"
                                                onClick={() => openRequestDetail(request)}
                                            >
                                                View Details
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                                    No pending approval requests
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

        <LeaveRequestDetail
            request={selectedRequest}
            open={requestDetailOpen}
            onOpenChange={setRequestDetailOpen}
            onApprove={handleApproveRequest}
            onReject={handleRejectRequest}
        />
    </div>
    )
}