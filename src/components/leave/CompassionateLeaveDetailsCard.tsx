import { useState } from "react";
import { Clock, Calendar, AlertCircle, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LeaveStatus } from "@/types";
import LeaveStatusBadge from "./LeaveStatusBadge";
import LeaveTimeline from "./LeaveTimeline";
import { Textarea } from "@/components/ui/textarea";

interface CompassionateLeaveDetailsCardProps {
    request: {
        id: string;
        workDate: string;
        reason: string;
        status: string;
        holiday: boolean;
        weekend: boolean;
        approvedBy?: {
            name: string;
            email: string;
        };
        approvedAt?: string;
        createdAt: string;
    };
    onCancel?: (id: string) => void;
    onApprove?: (id: string, comments: string) => void;
    onReject?: (id: string, comments: string) => void;
}

const CompassionateLeaveDetailsCard = ({
    request,
    onCancel,
    onApprove,
    onReject,
}: CompassionateLeaveDetailsCardProps) => {
    const [showTimeline, setShowTimeline] = useState(false);
    const [comments, setComments] = useState("");

    // Format date as DD MMM YYYY
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel(request.id);
        }
    };

    const handleApprove = () => {
        if (onApprove) {
            onApprove(request.id, comments);
        }
    };

    const handleReject = () => {
        if (onReject) {
            onReject(request.id, comments);
        }
    };

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-0">
                <div className="p-4 border-b">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold">Compassionate Leave</h3>
                        <LeaveStatusBadge status={request.status.toLowerCase() as LeaveStatus} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <div>
                                <p className="text-xs text-gray-500">Date</p>
                                <p className="text-sm font-medium">
                                    {formatDate(request.workDate)}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {request.holiday ? "Holiday" : request.weekend ? "Weekend" : ""}
                                </p>
                            </div>
                        </div>


                    </div>

                    {request.reason && (
                        <div className="mt-3">
                            <p className="text-xs text-gray-500 mb-1">Reason</p>
                            <p className="text-sm bg-gray-50 p-2 rounded">
                                {request.reason}
                            </p>
                        </div>
                    )}

                    {request.approvedBy && (
                        <div className="mt-3">
                            <p className="text-xs text-gray-500 mb-1">Approved By</p>
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-500" />
                                <div>
                                    <p className="text-sm font-medium">{request.approvedBy.name}</p>
                                    <p className="text-xs text-gray-500">{request.approvedBy.email}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {request.approvedAt && (
                        <div className="mt-2">
                            <p className="text-xs text-gray-500 mb-1">Approved On</p>
                            <p className="text-sm font-medium">
                                {formatDate(request.approvedAt)}
                            </p>
                        </div>
                    )}

                    {request.status === "PENDING" && (onApprove || onReject) && (
                        <div className="mt-4">
                            <p className="text-xs text-gray-500 mb-1">Comments</p>
                            <Textarea
                                placeholder="Add your comments here..."
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                className="min-h-[100px]"
                            />
                        </div>
                    )}
                </div>

                <div className="p-4 bg-gray-50 flex justify-between items-center">

                    <div className="flex gap-2">
                        {request.status === "PENDING" && onCancel && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={handleCancel}
                            >
                                Cancel Request
                            </Button>
                        )}
                        {request.status === "PENDING" && onApprove && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-green-600 border-green-200 hover:bg-green-50"
                                onClick={handleApprove}
                            >
                                Approve
                            </Button>
                        )}
                        {request.status === "PENDING" && onReject && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={handleReject}
                            >
                                Reject
                            </Button>
                        )}
                    </div>
                </div>


            </CardContent>
        </Card>
    );
};

export default CompassionateLeaveDetailsCard; 