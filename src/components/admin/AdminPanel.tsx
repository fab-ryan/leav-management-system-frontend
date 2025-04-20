import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import LeaveBalanceManager from "./LeaveBalanceManager";
import { HolidayManager } from "./HolidayManager";
import ReportGenerator from "./ReportGenerator";
import { LeavePolicy } from "./LeavePolicyManager";
import { DepartmentManager } from "./DepartmentManager";
import { EmployeeManager } from "./EmployeeManager";
import { ApprovalManager } from "./ApprovalManager";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("leave-types");

  // Mock data for pending requests





  return (
    <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-6 w-full mb-6
        
      ">
        <TabsTrigger value="leave-types">Leave Types & Policies</TabsTrigger>
        <TabsTrigger value="department">Department</TabsTrigger>
        <TabsTrigger value="employees">Employees</TabsTrigger>
        <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
        <TabsTrigger value="leave-balances">Leave Balances</TabsTrigger>
        {/* <TabsTrigger value="holidays">Holidays</TabsTrigger> */}
        {/* <TabsTrigger value="team-calendar">Team Calendar</TabsTrigger> */}
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>

      <TabsContent value="leave-types" className="space-y-4">
        <LeavePolicy />
      </TabsContent >
      <TabsContent value="department" className="space-y-4">
        <DepartmentManager />
      </TabsContent>

      <TabsContent value="employees" className="space-y-4">
        <EmployeeManager />
      </TabsContent>

      <TabsContent value="approvals" className="space-y-4">
        <ApprovalManager />
      </TabsContent>

      <TabsContent value="leave-balances" className="space-y-4">
        <LeaveBalanceManager />
      </TabsContent>

      {/* <TabsContent value="holidays" className="space-y-4">
        <HolidayManager />
      </TabsContent> */}

      {/* <TabsContent value="team-calendar" className="space-y-4">
        <TeamCalendarView />
      </TabsContent> */}

      <TabsContent value="reports" className="space-y-4">
        <ReportGenerator />
      </TabsContent>
    </Tabs >
  );
};

export default AdminPanel;
