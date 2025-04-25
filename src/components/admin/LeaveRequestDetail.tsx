
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { LeaveApplication, LeaveRequest } from "@/types";
import { Check, X, FileText, Download } from "lucide-react";
import UserAvatar from "@/components/ui/UserAvatar";
import { getProfilePictureUrl, redirectToFile } from "@/lib/utils";

interface LeaveRequestDetailProps {
  request: LeaveApplication | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (id: string, comments: string) => void;
  onReject: (id: string, comments: string) => void;
}

const LeaveRequestDetail = ({
  request,
  open,
  onOpenChange,
  onApprove,
  onReject
}: LeaveRequestDetailProps) => {
  const [comments, setComments] = useState("");

  if (!request) return null;

  // Format date as DD MMM YYYY
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
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
  const getLeaveTypeDisplay = (type: string) => {
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

  const handleApprove = () => {
    onApprove(request.id, comments);
    toast({
      title: "Leave request approved",
      description: "The employee has been notified",
    });
    setComments("");
    onOpenChange(false);
  };

  const handleReject = () => {
    onReject(request.id, comments);
    toast({
      title: "Leave request rejected",
      description: "The employee has been notified",
    });
    setComments("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Leave Request Details</DialogTitle>
          <DialogDescription>
            Review the leave request details before approving or rejecting.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center gap-4">
            <UserAvatar
              name={request.employee.name || "Unknown Employee"}
              size="lg"
              imageUrl={getProfilePictureUrl(request.employee.profilePictureUrl ?? "")}
            />
            <div>
              <h3 className="font-medium text-lg">
                {request.employee.name || "Unknown Employee"}
              </h3>
              <p className="text-muted-foreground text-sm">
                Requested on {formatDate(request.createdAt)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-b py-4">
            <div>
              <p className="text-sm text-muted-foreground">Leave Type</p>
              <p className="font-medium">{getLeaveTypeDisplay(request.leaveType)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium">
                {calculateDuration(new Date(request.startDate), new Date(request.endDate), request.isHalfDay)}
                {request.isHalfDay && (
                  <span className="text-xs text-muted-foreground block">
                    {request.isMorning ? "Morning" : "Afternoon"}
                  </span>
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">From</p>
              <p className="font-medium">{formatDate(request.startDate)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">To</p>
              <p className="font-medium">{formatDate(request.endDate)}</p>
            </div>
          </div>

          {request.reason && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Reason</p>
              <p className="bg-gray-50 p-3 rounded-md text-sm">{request.reason}</p>
            </div>
          )}

          {request.supportingDocuments && request.supportingDocuments.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Attached Documents</p>
              <div className="flex flex-wrap gap-2">
                {request.supportingDocuments.map((doc, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => redirectToFile(doc.filePath)}
                  >
                    <FileText className="h-4 w-4" />
                    <span>Document {index + 1}</span>
                    <Download className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-sm text-muted-foreground mb-1">Comments (Optional)</p>
            <Textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Add your comments here..."
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="outline"
            className="bg-red-100 text-red-800 border-red-300 hover:bg-red-200"
            onClick={handleReject}
            disabled={request.status === "REJECTED"}
          >
            <X className="mr-2 h-4 w-4" /> Reject
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={handleApprove}
            disabled={request.status === "APPROVED"}
          >
            <Check className="mr-2 h-4 w-4" /> Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveRequestDetail;
