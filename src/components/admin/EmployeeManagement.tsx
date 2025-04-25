import { useState, useEffect } from "react";
import { useGetAllDepartmentsQuery, useGetAllEmployeesQuery, useLeaveTypePoliciesQuery, usePostEmployeeMutation, useUpdateEmployeeMutation } from "@/features/api";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Edit, Loader, Plus, Search, ArrowUpDown, Download, ChevronLeft } from "lucide-react";
import { exportEmployeeToCSV, exportToCSV } from "@/lib/utils";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Pagination,
    PaginationContent,
} from "@/components/ui/pagination";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

type SortField = 'name' | 'email' | 'department' | 'role' | 'leavePolicy';
type SortDirection = 'asc' | 'desc';

const EmployeeManagement = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortField, setSortField] = useState<SortField>('name');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
    const [selectedRole, setSelectedRole] = useState<string>("all");
    const [selectedPolicy, setSelectedPolicy] = useState<string>("all");
    const [isAddDialogOpen, setAddDialogOpen] = useState<boolean>(false);

    const { data: employees, isLoading, refetch } = useGetAllEmployeesQuery({
        page: currentPage,
        size: pageSize,
        sort: `${sortField},${sortDirection}`,
        department: selectedDepartment !== "all" ? selectedDepartment : undefined,
        role: selectedRole !== "all" ? selectedRole : undefined,
        policy: selectedPolicy !== "all" ? selectedPolicy : undefined,
        search: searchTerm.length > 2 ? searchTerm : undefined,
    }, {
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
    });
    const [editEmployee, setEditEmployee] = useState(false);
    const [editEmployeeId, setEditEmployeeId] = useState<string | null>(null);
    const { data: policies } = useLeaveTypePoliciesQuery();

    const totalPages = employees?.users?.totalPages || 1;

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleExport = () => {
        if (employees?.users?.content.length === 0) {
            toast({
                title: 'No employees found',
                description: 'Please add or search for some employees to export',
                variant: 'destructive',
            })
            return;
        }
        exportEmployeeToCSV({
            page: currentPage,
            size: pageSize,
            sort: `${sortDirection}`,
            department: selectedDepartment !== "all" ? selectedDepartment : undefined,
            role: selectedRole !== "all" ? selectedRole : undefined,
            policy: selectedPolicy !== "all" ? selectedPolicy : undefined,
            search: searchTerm.length > 2 ? searchTerm : undefined,
        })
    };

    const [postEmployee, postEmployeeState] = usePostEmployeeMutation()
    const { data: departments } = useGetAllDepartmentsQuery();
    const [updateEmployee, updateEmployeeState] = useUpdateEmployeeMutation()
    const form = useForm<EmployeeFormValues>({
        resolver: zodResolver(employeeSchema),
        defaultValues: {
            name: '',
            email: '',
            role: 'EMPLOYEE',
            phoneNumber: '',
            emergencyContact: '',
            emergencyPhoneNumber: '',
            team: '',
            location: '',
        },
        mode: 'onBlur',
    });
    useEffect(() => {
        if (postEmployeeState.isSuccess) {
            refetch();
            setAddDialogOpen(false);
            form.reset();
        }
        if (updateEmployeeState.isSuccess) {
            refetch();
            setEditEmployee(false);
            setAddDialogOpen(false);
            form.reset();
        }
    }, [refetch, postEmployeeState.isSuccess, updateEmployeeState.isSuccess]);

    const UpdateCreateEmployee = () => {

        const handleSubmit = (data: EmployeeFormValues) => {

            if (postEmployeeState.isLoading) {
                return;
            }
            postEmployee({
                ...data,
                password: 'password',
                departmentId: data.departmentId,
                role: data.role,
                phoneNumber: data.phoneNumber,
                name: data.name,
                email: data.email,
                leavePolicyId: data.policyId,
            }).unwrap()
                .then((res) => {
                    toast({
                        title: 'Success',
                        description: 'Employee created successfully',
                        duration: 500000,
                        variant: 'success',
                    });

                    form.reset();
                }).catch((err) => {
                    toast({
                        title: 'Error',
                        description: 'Something went wrong',
                        duration: 5000,
                        variant: 'destructive',
                    })
                });
        };
        const handleUpdateSubmit = (data: EmployeeFormValues) => {
            if (updateEmployeeState.isLoading) {
                return;
            }
            updateEmployee({
                id: editEmployeeId,
                data: {
                    ...data,
                    departmentId: data.departmentId,
                    role: data.role,
                    phoneNumber: data.phoneNumber,
                    leavePolicyId: data.policyId,
                }
            }).unwrap()
                .then((res) => {
                    toast({
                        title: 'Success',
                        description: 'Employee updated successfully',
                        duration: 5000,
                        variant: 'success',
                    })

                    form.reset();
                    setEditEmployee(false);
                    setAddDialogOpen(false);
                    setEditEmployeeId(null);
                }).catch((err) => {
                    console.log(err);
                    toast({
                        title: 'Error',
                        description: 'Something went wrong',
                        duration: 5000,
                        variant: 'destructive',
                    })
                    form.reset();
                    setEditEmployee(false);
                    setAddDialogOpen(false);
                    setEditEmployeeId(null);
                });

        }
        return (<Form {...form}>
            <form onSubmit={editEmployee ? form.handleSubmit(handleUpdateSubmit) : form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter full name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="Enter email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Role</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="EMPLOYEE">Employee</SelectItem>
                                        <SelectItem value="MANAGER">Manager</SelectItem>
                                        <SelectItem value="ADMIN">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter phone number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="departmentId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Department</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departments?.departments?.map((dept) => (
                                            <SelectItem key={dept.id} value={dept.id}>
                                                {dept.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="policyId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Leave Policy</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select leave policy" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {policies?.policies?.map((policy) => (
                                            <SelectItem key={policy.id} value={policy.id}>
                                                {policy.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="emergencyContact"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Emergency Contact</FormLabel>
                                <FormControl>
                                    <Input placeholder="Emergency contact name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="emergencyPhoneNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Emergency Phone Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="Emergency contact number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="team"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Team</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter team" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter location" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit">Submit</Button>
            </form>
        </Form>)
    }


    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Employee Management</h2>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                    <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                onClick={() => {
                                    form.reset();
                                    setEditEmployee(false);
                                    setAddDialogOpen(true);
                                }}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Employee
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[800px]">
                            <DialogHeader>
                                <DialogTitle>{editEmployee ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
                                <DialogDescription>
                                    {editEmployee ? 'Update the Employee details' : 'Create a newEmployee'}
                                </DialogDescription>
                            </DialogHeader>
                            <UpdateCreateEmployee />

                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Card>
                <CardContent className="p-4 space-y-4">
                    <div className="flex flex-wrap gap-4">
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Search employees..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </div>

                        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select Department" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Departments</SelectItem>
                                {departments?.departments?.map((dept) => (
                                    <SelectItem key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={selectedRole} onValueChange={setSelectedRole}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                                <SelectItem value="MANAGER">Manager</SelectItem>
                                <SelectItem value="EMPLOYEE">Employee</SelectItem>
                            </SelectContent>
                        </Select>


                        <Select value={selectedPolicy} onValueChange={setSelectedPolicy}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select Policy" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Policies</SelectItem>
                                {policies?.policies?.map((policy) => (
                                    <SelectItem key={policy.id} value={policy.id}>
                                        {policy.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="rounded-md border">
                        {isLoading ? (
                            <div className="p-4">
                                <Loader className="w-[40px] h-[40px] m-auto animate-spin" />
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead
                                            className="cursor-pointer"
                                            onClick={() => handleSort('name')}
                                        >
                                            <div className="flex items-center gap-1">
                                                Name
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer"
                                            onClick={() => handleSort('email')}
                                        >
                                            <div className="flex items-center gap-1">
                                                Email
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer"
                                            onClick={() => handleSort('department')}
                                        >
                                            <div className="flex items-center gap-1">
                                                Department
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer"
                                            onClick={() => handleSort('role')}
                                        >
                                            <div className="flex items-center gap-1">
                                                Role
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer"
                                            onClick={() => handleSort('leavePolicy')}
                                        >
                                            <div className="flex items-center gap-1">
                                                Leave Policy
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {employees?.users?.content?.map((employee) => (
                                        <TableRow key={employee.id}>
                                            <TableCell className="font-medium">{employee.name}</TableCell>
                                            <TableCell>{employee.email}</TableCell>
                                            <TableCell>{employee?.department?.name}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        employee.role.toLowerCase() === "admin"
                                                            ? "bg-purple-100 text-purple-800 border-purple-300"
                                                            : employee.role === "manager"
                                                                ? "bg-blue-100 text-blue-800 border-blue-300"
                                                                : "bg-green-100 text-green-800 border-green-300"
                                                    }
                                                >
                                                    {employee.role?.toLowerCase() === "admin"
                                                        ? "Admin"
                                                        : employee.role?.toLowerCase() === "manager"
                                                            ? "Manager"
                                                            : "Employee"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{employee?.leavePolicy?.name}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon"
                                                    onClick={() => {
                                                        setEditEmployee(true);
                                                        setAddDialogOpen(true);
                                                        form.setValue('name', employee.name);
                                                        form.setValue('email', employee.email);
                                                        form.setValue('role', employee?.role as "ADMIN" | "MANAGER" | "STAFF" | "EMPLOYEE");
                                                        form.setValue('phoneNumber', employee.phoneNumber);
                                                        form.setValue('departmentId', employee?.department?.id ?? '');
                                                        form.setValue('emergencyContact', employee?.emergencyPhoneNumber ?? '');
                                                        form.setValue('emergencyPhoneNumber', employee?.emergencyPhoneNumber ?? '');
                                                        form.setValue('team', employee?.team ?? '');
                                                        form.setValue('location', employee?.location ?? '');
                                                        form.setValue('policyId', employee?.leavePolicy?.id ?? '');
                                                        setEditEmployeeId(employee.id);
                                                    }}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center space-x-2 w-full">
                            <p className="text-sm text-gray-700">
                                Page {currentPage + 1} of {totalPages}
                            </p>
                            <Select
                                value={pageSize.toString()}
                                onValueChange={(value) => {
                                    setPageSize(Number(value));
                                    setCurrentPage(0);
                                }}
                            >
                                <SelectTrigger className="h-8 w-[70px]">
                                    <SelectValue placeholder={pageSize} />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {[10, 20, 30, 40, 50].map((size) => (
                                        <SelectItem key={size} value={size.toString()}>
                                            {size}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Pagination>
                            <PaginationContent>

                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                                        disabled={currentPage === 0}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage + 1 === totalPages}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default EmployeeManagement;

const employeeSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(120),
    email: z.string().email('Invalid email format'),
    role: z.enum(['ADMIN', 'MANAGER', 'STAFF', 'EMPLOYEE']),
    phoneNumber: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number format'),
    departmentId: z.string().uuid(),
    emergencyContact: z.string().max(100).optional(),
    emergencyPhoneNumber: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid emergency phone number format').optional(),
    team: z.string().optional(),
    location: z.string().optional(),
    policyId: z.string().uuid(),
});
type EmployeeFormValues = z.infer<typeof employeeSchema>;