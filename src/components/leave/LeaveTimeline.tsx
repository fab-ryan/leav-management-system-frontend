
import { Clock, Check, X, Calendar, FileText, MessageCircle } from "lucide-react";
import { LeaveRequest } from "@/types";

interface LeaveTimelineProps {
  request: LeaveRequest;
}

const LeaveTimeline = ({ request }: LeaveTimelineProps) => {
  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <h3 className="font-medium text-sm text-gray-700">Request Timeline</h3>
      <ol className="relative border-l border-gray-200">
        {/* Submitted step - always present */}
        <li className="mb-6 ml-6">
          <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
            <Calendar className="w-3 h-3 text-blue-800" />
          </span>
          <h3 className="flex items-center mb-1 text-sm font-semibold text-gray-900">
            Request Submitted
          </h3>
          <time className="block mb-2 text-xs font-normal leading-none text-gray-400">
            {formatDate(request.createdAt)}
          </time>
          {request.documentUrls && request.documentUrls.length > 0 && (
            <div className="text-xs text-gray-500 mt-1 flex items-center">
              <FileText className="w-3 h-3 mr-1" />
              {request.documentUrls.length} document{request.documentUrls.length !== 1 ? 's' : ''} attached
            </div>
          )}
        </li>

        {/* In progress step - shown for pending */}
        {request.status === "pending" && (
          <li className="mb-6 ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-yellow-100 rounded-full -left-3 ring-8 ring-white">
              <Clock className="w-3 h-3 text-yellow-800" />
            </span>
            <h3 className="flex items-center mb-1 text-sm font-semibold text-gray-900">
              Pending Approval
            </h3>
            <p className="text-xs text-gray-500">
              Your request is being reviewed by your manager
            </p>
          </li>
        )}

        {/* Approved step */}
        {request.status === "approved" && (
          <li className="mb-6 ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3 ring-8 ring-white">
              <Check className="w-3 h-3 text-green-800" />
            </span>
            <h3 className="flex items-center mb-1 text-sm font-semibold text-gray-900">
              Approved
            </h3>
            <time className="block mb-2 text-xs font-normal leading-none text-gray-400">
              {request.updatedAt && formatDate(request.updatedAt)}
            </time>
            {request.comments && (
              <div className="p-2 bg-white rounded border text-xs text-gray-600">
                <div className="flex items-center mb-1">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  <span className="font-medium">Comments:</span>
                </div>
                {request.comments}
              </div>
            )}
          </li>
        )}

        {/* Rejected step */}
        {request.status === "rejected" && (
          <li className="mb-6 ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-red-100 rounded-full -left-3 ring-8 ring-white">
              <X className="w-3 h-3 text-red-800" />
            </span>
            <h3 className="flex items-center mb-1 text-sm font-semibold text-gray-900">
              Rejected
            </h3>
            <time className="block mb-2 text-xs font-normal leading-none text-gray-400">
              {request.updatedAt && formatDate(request.updatedAt)}
            </time>
            {request.comments && (
              <div className="p-2 bg-white rounded border text-xs text-gray-600">
                <div className="flex items-center mb-1">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  <span className="font-medium">Reason for rejection:</span>
                </div>
                {request.comments}
              </div>
            )}
          </li>
        )}

        {/* Cancelled step */}
        {request.status === "cancelled" && (
          <li className="mb-6 ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-gray-200 rounded-full -left-3 ring-8 ring-white">
              <X className="w-3 h-3 text-gray-600" />
            </span>
            <h3 className="flex items-center mb-1 text-sm font-semibold text-gray-900">
              Cancelled
            </h3>
            <time className="block mb-2 text-xs font-normal leading-none text-gray-400">
              {request.updatedAt && formatDate(request.updatedAt)}
            </time>
            <p className="text-xs text-gray-500">
              You cancelled this leave request
            </p>
          </li>
        )}
      </ol>
    </div>
  );
};

export default LeaveTimeline;
