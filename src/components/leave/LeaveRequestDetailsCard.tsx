
import { useState } from "react";
import { Clock, Calendar, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LeaveApplication, LeaveRequest, LeaveStatus, LeaveType } from "@/types";
import LeaveStatusBadge from "./LeaveStatusBadge";
import LeaveTimeline from "./LeaveTimeline";

interface LeaveRequestDetailsCardProps {
  request: LeaveApplication;
  onCancel?: (id: string) => void;
}

const LeaveRequestDetailsCard = ({
  request,
  onCancel,
}: LeaveRequestDetailsCardProps) => {
  const [showTimeline, setShowTimeline] = useState(false);

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

  const handleCancel = () => {
    if (onCancel) {
      onCancel(request.id);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">{getLeaveTypeDisplay(request.leaveType.toLowerCase() as LeaveType)}</h3>
            <LeaveStatusBadge status={request.status.toLowerCase() as LeaveStatus} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Date Range</p>
                <p className="text-sm font-medium">
                  {formatDate(new Date(request.startDate))}
                  {!request.isHalfDay &&
                    new Date(request.startDate).getTime() !== new Date(request.endDate).getTime() &&
                    ` - ${formatDate(new Date(request.endDate))}`
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Duration</p>
                <p className="text-sm font-medium">
                  {calculateDuration(new Date(request.startDate), new Date(request.endDate), request.isHalfDay)}
                  {request.isHalfDay && (
                    <span className="text-xs text-gray-500 block">
                      {request.isMorning ? "Morning" : "Afternoon"}
                    </span>
                  )}
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
        </div>

        <div className="p-4 bg-gray-50 flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTimeline(!showTimeline)}
          >
            {showTimeline ? "Hide" : "Show"} Timeline
          </Button>

          {request.status === "pending" && onCancel && (
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={handleCancel}
            >
              Cancel Request
            </Button>
          )}
        </div>

        {showTimeline && (
          <div className="border-t">
            <LeaveTimeline request={request} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeaveRequestDetailsCard;
