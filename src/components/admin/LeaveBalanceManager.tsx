
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Save, Edit } from "lucide-react";
import UserAvatar from "@/components/ui/UserAvatar";

type EmployeeBalance = {
  id: string;
  name: string;
  email: string;
  department: string;
  annual: number;
  sick: number;
  personal: number;
  carryForward: number;
};

const LeaveBalanceManager = () => {
  // Mock employee balance data
  const [employees, setEmployees] = useState<EmployeeBalance[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      department: "Engineering",
      annual: 20,
      sick: 10,
      personal: 3,
      carryForward: 5,
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      department: "Design",
      annual: 18,
      sick: 10,
      personal: 3,
      carryForward: 0,
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike.johnson@example.com",
      department: "Marketing",
      annual: 15,
      sick: 8,
      personal: 3,
      carryForward: 2,
    },
    {
      id: "4",
      name: "Sarah Williams",
      email: "sarah.williams@example.com",
      department: "HR",
      annual: 22,
      sick: 10,
      personal: 5,
      carryForward: 0,
    },
  ]);

  const [editingEmployee, setEditingEmployee] = useState<EmployeeBalance | null>(null);
  const [adjustmentDialog, setAdjustmentDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter employees based on search query
  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdjustment = () => {
    if (!editingEmployee) return;
    
    setEmployees(employees.map(emp => 
      emp.id === editingEmployee.id ? editingEmployee : emp
    ));
    
    toast({
      title: "Leave balance updated",
      description: `Updated leave balance for ${editingEmployee.name}`,
    });
    
    setAdjustmentDialog(false);
    setEditingEmployee(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Input
            type="search"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-2.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Manual Adjustment
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Annual Leave</TableHead>
              <TableHead>Sick Leave</TableHead>
              <TableHead>Personal Leave</TableHead>
              <TableHead>Carry Forward</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <UserAvatar name={employee.name} size="sm" />
                    <div>
                      <p className="font-medium">{employee.name}</p>
                      <p className="text-xs text-muted-foreground">{employee.department}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{employee.annual} days</TableCell>
                <TableCell>{employee.sick} days</TableCell>
                <TableCell>{employee.personal} days</TableCell>
                <TableCell>{employee.carryForward} days</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingEmployee(employee);
                      setAdjustmentDialog(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={adjustmentDialog} onOpenChange={setAdjustmentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Leave Balance</DialogTitle>
            <DialogDescription>
              Update leave balance for {editingEmployee?.name}
            </DialogDescription>
          </DialogHeader>
          
          {editingEmployee && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-3 mb-4">
                <UserAvatar name={editingEmployee.name} size="md" />
                <div>
                  <p className="font-medium">{editingEmployee.name}</p>
                  <p className="text-sm text-muted-foreground">{editingEmployee.department}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm">Annual Leave</label>
                <Input
                  className="col-span-3"
                  type="number"
                  value={editingEmployee.annual}
                  onChange={(e) => setEditingEmployee({
                    ...editingEmployee,
                    annual: Number(e.target.value)
                  })}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm">Sick Leave</label>
                <Input
                  className="col-span-3"
                  type="number"
                  value={editingEmployee.sick}
                  onChange={(e) => setEditingEmployee({
                    ...editingEmployee,
                    sick: Number(e.target.value)
                  })}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm">Personal Leave</label>
                <Input
                  className="col-span-3"
                  type="number"
                  value={editingEmployee.personal}
                  onChange={(e) => setEditingEmployee({
                    ...editingEmployee,
                    personal: Number(e.target.value)
                  })}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm">Carry Forward</label>
                <Input
                  className="col-span-3"
                  type="number"
                  value={editingEmployee.carryForward}
                  onChange={(e) => setEditingEmployee({
                    ...editingEmployee,
                    carryForward: Number(e.target.value)
                  })}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustmentDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdjustment}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeaveBalanceManager;
