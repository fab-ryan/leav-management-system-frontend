
import { Badge } from "@/components/ui/badge";
import { LeaveStatus } from "@/types";

interface LeaveStatusBadgeProps {
  status: LeaveStatus;
  className?: string;
  variant?: "small" | "medium" | "large";
  showDot?: boolean;
}

const LeaveStatusBadge = ({ 
  status, 
  className = "", 
  variant = "medium",
  showDot = false
}: LeaveStatusBadgeProps) => {
  const getVariantClass = () => {
    switch (variant) {
      case "small": return "text-xs py-0 px-2";
      case "large": return "text-base py-1 px-3";
      default: return "text-sm py-0.5 px-2.5";
    }
  };

  const getBadgeStyles = () => {
    switch (status) {
      case "pending":
        return `bg-yellow-100 text-yellow-800 border-yellow-300 ${className}`;
      case "approved":
        return `bg-green-100 text-green-800 border-green-300 ${className}`;
      case "rejected":
        return `bg-red-100 text-red-800 border-red-300 ${className}`;
      case "cancelled":
        return `bg-gray-100 text-gray-800 border-gray-300 ${className}`;
      default:
        return className;
    }
  };

  return (
    <Badge
      variant="outline"
      className={`flex items-center gap-1.5 font-medium ${getBadgeStyles()} ${getVariantClass()}`}
    >
      {showDot && (
        <span className={`h-2 w-2 rounded-full ${
          status === "pending" ? "bg-yellow-500" :
          status === "approved" ? "bg-green-500" :
          status === "rejected" ? "bg-red-500" :
          "bg-gray-500"
        }`} />
      )}
      {status === "pending" ? "Pending" :
       status === "approved" ? "Approved" :
       status === "rejected" ? "Rejected" :
       status === "cancelled" ? "Cancelled" : status}
    </Badge>
  );
};

export default LeaveStatusBadge;
