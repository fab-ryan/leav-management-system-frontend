import { useState, useEffect } from "react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useGetAllLeavePoliciesBalanceQuery, useUpdateLeaveBalanceByAdminMutation } from "@/features/api/policyApi";
import { LeaveBalance, LeaveBalances } from "@/types";
import { formatDate, getProfilePictureUrl } from "@/lib/utils";

const leaveBalanceSchema = z.object({
  annualBalance: z.number().min(1, 'Annual leave must be 0 or greater'),
  sickBalance: z.number().min(1, 'Sick leave must be 0 or greater'),
  personalBalance: z.number().min(1, 'Personal leave must be 0 or greater'),
  carryForwardBalance: z.number().min(1, 'Carry forward must be 0 or greater'),
  maternityBalance: z.number().min(1, 'Maternity leave must be 0 or greater'),
  paternityBalance: z.number().min(1, 'Paternity leave must be 0 or greater'),
  unpaidBalance: z.number().min(1, 'Unpaid leave must be 0 or greater'),
  otherBalance: z.number().min(1, 'Other leave must be 0 or greater'),
});

type LeaveBalanceFormValues = z.infer<typeof leaveBalanceSchema>;


const LeaveBalanceManager = () => {
  const { data: employees, isLoading, refetch } = useGetAllLeavePoliciesBalanceQuery();
 
  const [updateLeaveBalanceByAdmin, { isLoading: isUpdating, isSuccess }] = useUpdateLeaveBalanceByAdminMutation()
  const [editingEmployee, setEditingEmployee] = useState<LeaveBalances | null>(null);
  const [adjustmentDialog, setAdjustmentDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const form = useForm<LeaveBalanceFormValues>({
    resolver: zodResolver(leaveBalanceSchema),
    defaultValues: {
      annualBalance: 0,
      sickBalance: 0,
      personalBalance: 0,
      carryForwardBalance: 0,
      maternityBalance: 0,
      paternityBalance: 0,
      unpaidBalance: 0,
      otherBalance: 0,
    }
  });
  useEffect(() => {
    if (isSuccess) {
      refetch();
    }
  }, [isSuccess, refetch]);

  useEffect(() => {
    if (editingEmployee) {
      form.setValue('annualBalance', editingEmployee.annualBalance);
      form.setValue('sickBalance', editingEmployee.sickBalance);
      form.setValue('personalBalance', editingEmployee.personalBalance);
      form.setValue('carryForwardBalance', editingEmployee.carryForwardBalance);
      form.setValue('maternityBalance', editingEmployee.maternityBalance);
      form.setValue('paternityBalance', editingEmployee.paternityBalance);
      form.setValue('unpaidBalance', editingEmployee.unpaidBalance);
      form.setValue('otherBalance', editingEmployee.otherBalance);
    }
  }, [editingEmployee, form]);

  // Filter employees based on search query
  const filteredEmployees = employees?.leave_balances?.filter(employee =>
    employee.employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.employee.department?.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleAdjustment = (data: LeaveBalanceFormValues) => {
    if (!editingEmployee) return;
    if (isUpdating) return;
    const updatedEmployee = {
      ...editingEmployee,
      annualBalance: data.annualBalance,
      sickBalance: data.sickBalance,
      personalBalance: data.personalBalance,
      carryForwardBalance: data.carryForwardBalance,
    };
    updateLeaveBalanceByAdmin({ id: editingEmployee.employee.id, data: updatedEmployee }).unwrap()
      .then((res) => {
        toast({
          title: "Leave balance updated",
          description: `Updated leave balance for ${updatedEmployee.employee.name}`,
        });

        setAdjustmentDialog(false);
        setEditingEmployee(null);
        form.reset();
      })
      .catch((err) => {
        toast({
          title: "Error updating leave balance",
          description: err.message,
          variant: "destructive",
        });
      });
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


      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>any</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Annual Leave</TableHead>
              <TableHead>Sick Leave</TableHead>
              <TableHead>Personal Leave</TableHead>
              <TableHead>Carry Forward</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <UserAvatar name={employee.employee.name} size="sm" />
                    <div>
                      <p className="font-medium">{employee.employee.name}</p>
                      <p className="text-sm text-muted-foreground">{employee.employee.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{employee.employee.department?.name}</TableCell>
                <TableCell>{employee.annualBalance} days</TableCell>
                <TableCell>{employee.sickBalance} days</TableCell>
                <TableCell>{employee.personalBalance} days</TableCell>
                <TableCell>{employee.carryForwardBalance} days</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingEmployee(employee);
                      setAdjustmentDialog(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={adjustmentDialog} onOpenChange={setAdjustmentDialog}>
        <DialogContent
          className="sm:max-w-[800px]"
        >
          <DialogHeader>
            <DialogTitle>Adjust Leave Balance</DialogTitle>
            <DialogDescription>
              Update the leave balances for {editingEmployee?.employee.name}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAdjustment)} className="space-y-4">

              <div className="flex items-center gap-4">
                    <UserAvatar
                      name={editingEmployee?.employee.name ?? ""}
                      imageUrl={getProfilePictureUrl(editingEmployee?.employee.profilePictureUrl ?? "")}
                      size="lg"
                    />

                <div>
                  <h3 className="font-medium text-lg">
                    {editingEmployee?.employee.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Requested on {formatDate( editingEmployee?.createdAt || "")}
                  </p>
                </div>
              </div>
              <div className="space-y-4">

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="annualBalance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Annual Leave (days)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Days per year"
                            {...field}
                            onChange={e => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sickBalance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sick Leave (days)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Days per year"
                            {...field}
                            onChange={e => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="personalBalance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Personal Leave (days)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Days per year"
                            {...field}
                            onChange={e => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="carryForwardBalance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Carry Forward (days)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Maximum days"
                            {...field}
                            onChange={e => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maternityBalance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maternity Leave (days)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Days per year"
                            {...field}
                            onChange={e => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="paternityBalance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Paternity Leave (days)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Days per year"
                            {...field}
                            onChange={e => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="unpaidBalance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unpaid Leave (days)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Days per year"
                            {...field}

                            onChange={e => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="otherBalance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Other Leave (days)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Days per year"
                            {...field}
                            onChange={e => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                </div>



              </div>
              <DialogFooter>

                <Button type="submit">
                  {editingEmployee ? 'Update' : 'Save'}
                </Button>
              </DialogFooter>
            </form>

          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeaveBalanceManager;
