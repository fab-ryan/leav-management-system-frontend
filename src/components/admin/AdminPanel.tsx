import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import LeaveBalanceManager from "./LeaveBalanceManager";
import ReportGenerator from "./ReportGenerator";
import { LeavePolicy } from "./LeavePolicyManager";
import { DepartmentManager } from "./DepartmentManager";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("reports");


  return (
    <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-4 w-full mb-6">
        <TabsTrigger value="reports">Leave Ratings</TabsTrigger>
        <TabsTrigger value="leave-types">Leave Types & Policies</TabsTrigger>
        <TabsTrigger value="department">Department</TabsTrigger>
        <TabsTrigger value="leave-balances">Leave Balances</TabsTrigger>
      </TabsList>

      <TabsContent value="leave-types" className="space-y-4">
        <LeavePolicy />
      </TabsContent>
      <TabsContent value="department" className="space-y-4">
        <DepartmentManager />
      </TabsContent>

      <TabsContent value="leave-balances" className="space-y-4">
        <LeaveBalanceManager />
      </TabsContent>

      <TabsContent value="reports" className="space-y-4">
        <ReportGenerator />
      </TabsContent>
    </Tabs>
  );
};

export default AdminPanel;
