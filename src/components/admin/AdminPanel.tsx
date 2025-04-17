import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { Edit, Plus, Search, } from "lucide-react";
import { LeaveRequest } from "@/types";
import LeaveRequestDetail from "./LeaveRequestDetail";
import LeaveBalanceManager from "./LeaveBalanceManager";
import HolidayManager from "./HolidayManager";
import ReportGenerator from "./ReportGenerator";
import { LeavePolicy } from "./LeavePolicyManager";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("leave-types");
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [requestDetailOpen, setRequestDetailOpen] = useState(false);


  // Mock data for employees
  const employees = [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      department: "Engineering",
      role: "staff",
      policy: "Standard Policy",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      department: "Design",
      role: "staff",
      policy: "Standard Policy",
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike.johnson@example.com",
      department: "Marketing",
      role: "staff",
      policy: "Standard Policy",
    },
    {
      id: "4",
      name: "Sarah Williams",
      email: "sarah.williams@example.com",
      department: "HR",
      role: "manager",
      policy: "Standard Policy",
    },
    {
      id: "5",
      name: "David Brown",
      email: "david.brown@example.com",
      department: "Executive",
      role: "admin",
      policy: "Executive Policy",
    },
  ];
  const openRequestDetail = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setRequestDetailOpen(true);
  };
  // Mock data for pending requests
  const [pendingRequests, setPendingRequests] = useState<LeaveRequest[]>([
    {
      id: "1",
      userId: "user1",
      employee: "John Doe",
      type: "annual",
      status: "pending",
      startDate: new Date(2025, 4, 12),
      endDate: new Date(2025, 4, 16),
      isHalfDay: false,
      reason: "Family vacation planned months in advance",
      createdAt: new Date(2025, 3, 25),
      updatedAt: new Date(2025, 3, 25),
    },
    {
      id: "2",
      userId: "user2",
      employee: "Jane Smith",
      type: "sick",
      status: "pending",
      startDate: new Date(2025, 3, 22),
      endDate: new Date(2025, 3, 23),
      isHalfDay: false,
      reason: "Doctor's appointment and recovery",
      createdAt: new Date(2025, 3, 21),
      updatedAt: new Date(2025, 3, 21),
    },
    {
      id: "3",
      userId: "user3",
      employee: "Mike Johnson",
      type: "personal",
      status: "pending",
      startDate: new Date(2025, 4, 5),
      endDate: new Date(2025, 4, 5),
      isHalfDay: true,
      isMorning: true,
      reason: "Personal appointment",
      createdAt: new Date(2025, 4, 1),
      updatedAt: new Date(2025, 4, 1),
    },
  ]);



  // Approve leave request
  const handleApproveRequest = (id: string, comments: string) => {
    console.log(`Approving request ${id} with comments: ${comments}`);
    setPendingRequests(pendingRequests.filter(req => req.id !== id));
  };

  // Reject leave request
  const handleRejectRequest = (id: string, comments: string) => {
    console.log(`Rejecting request ${id} with comments: ${comments}`);
    setPendingRequests(pendingRequests.filter(req => req.id !== id));
  };


  return (
    <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-5 w-full mb-6">
        <TabsTrigger value="leave-types">Leave Types & Policies</TabsTrigger>
        <TabsTrigger value="employees">Employees</TabsTrigger>
        <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
        <TabsTrigger value="leave-balances">Leave Balances</TabsTrigger>
        {/* <TabsTrigger value="holidays">Holidays</TabsTrigger>
        <TabsTrigger value="team-calendar">Team Calendar</TabsTrigger> */}
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>

      <TabsContent value="leave-types" className="space-y-4">
        <LeavePolicy />
      </TabsContent >

      <TabsContent value="employees" className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Manage Employees</h2>
          <div className="flex gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search employees..."
                className="pl-8"
              />
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Leave Policy</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          employee.role === "admin"
                            ? "bg-purple-100 text-purple-800 border-purple-300"
                            : employee.role === "manager"
                              ? "bg-blue-100 text-blue-800 border-blue-300"
                              : "bg-green-100 text-green-800 border-green-300"
                        }
                      >
                        {employee.role === "admin"
                          ? "Admin"
                          : employee.role === "manager"
                            ? "Manager"
                            : "Staff"}
                      </Badge>
                    </TableCell>
                    <TableCell>{employee.policy}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="approvals" className="space-y-4">
        <div className="flex justify-between items-center">
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
                {pendingRequests.length > 0 ? (
                  pendingRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.employee}</TableCell>
                      <TableCell>
                        {request.type === "annual" ? "Annual Leave" :
                          request.type === "sick" ? "Sick Leave" :
                            request.type === "personal" ? "Personal Leave" : request.type}
                      </TableCell>
                      <TableCell>
                        {request.startDate.toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        {request.endDate.toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        {request.createdAt.toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
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
