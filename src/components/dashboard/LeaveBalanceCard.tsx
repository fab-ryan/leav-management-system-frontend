
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  useGetLeaveBalanceQuery,
  useGetDefaultLeavePolicyQuery
} from "@/features/api";
import { Loader2 } from "lucide-react";

export const LeaveBalanceCard = () => {
  const { data: leaveBalance, isLoading } = useGetLeaveBalanceQuery();
  const { data: leavePolicy, isLoading: isLoadingPolicy } = useGetDefaultLeavePolicyQuery();
  // Mock data - would come from API
  const leaveBalances = {
    annual: {
      used: leaveBalance?.leave_balance?.annualBalance,
      total: leavePolicy?.policy?.annualAllowance || 0,
      name: "Annual Leave",
    },
    sick: {
      used: leaveBalance?.leave_balance?.sickBalance,
      total: leavePolicy?.policy?.sickAllowance || 0,
      name: "Sick Leave",
    },
    personal: {
      used: leaveBalance?.leave_balance?.personalBalance,
      total: leavePolicy?.policy?.personalAllowance || 0,
      name: "Personal Leave",
    },
    carryForward: {
      used: leaveBalance?.leave_balance?.carryForwardBalance,
      total: leavePolicy?.policy?.carryForwardLimit || 0,
      name: "Carry Forward",
    },
    maternity: {
      used: leaveBalance?.leave_balance?.maternityBalance,
      total: leavePolicy?.policy?.maternityAllowance || 0,
      name: "Maternity Leave",
    },
    paternity: {
      used: leaveBalance?.leave_balance?.paternityBalance,
      total: leavePolicy?.policy?.paternityAllowance || 0,
      name: "Paternity Leave",
    },
    unpaid: {
      used: leaveBalance?.leave_balance?.unpaidBalance,
      total: leavePolicy?.policy?.unpaidAllowance || 0,
      name: "Unpaid Leave",
    },
    other: {
      used: leaveBalance?.leave_balance?.otherBalance,
      total: leavePolicy?.policy?.otherAllowance || 0,
      name: "Other Leave",
    },
  };

  const calculatePercentage = (used: number, total: number) => {
    return (used / total) * 100;
  };

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Your Leave Balance</CardTitle>
        <CardDescription>
          Available leave for the current year
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {
          (isLoading || isLoadingPolicy) &&
          <div className="flex justify-center items-center h-32">
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          </div>

        }
        {Object.entries(leaveBalances).map(([key, { used, total, name }]) => (
          <div key={key} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{name}</span>
              <span>
                {used} remaining of {total} days
              </span>
            </div>
            <Progress value={calculatePercentage(used, total)} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
