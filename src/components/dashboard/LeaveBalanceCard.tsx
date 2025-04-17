
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const LeaveBalanceCard = () => {
  // Mock data - would come from API
  const leaveBalances = {
    annual: {
      used: 5,
      total: 20,
      name: "Annual Leave",
    },
    sick: {
      used: 2,
      total: 10,
      name: "Sick Leave",
    },
    personal: {
      used: 1,
      total: 3,
      name: "Personal Leave",
    },
    carryForward: {
      used: 0,
      total: 5,
      name: "Carry Forward",
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
        {Object.entries(leaveBalances).map(([key, { used, total, name }]) => (
          <div key={key} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{name}</span>
              <span>
                {total - used} remaining of {total} days
              </span>
            </div>
            <Progress value={calculatePercentage(used, total)} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
