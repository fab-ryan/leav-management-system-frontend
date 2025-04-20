import { useGetAllDepartmentsQuery, useGetAllEmployeesQuery, usePostEmployeeMutation, useUpdateEmployeeMutation } from "@/features/api";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Edit, Loader, Plus, Search, } from "lucide-react";
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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import * as z from 'zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { toast } from "@/hooks/use-toast";

export const EmployeeManager = () => {
    const [isAddDialogOpen, setAddDialogOpen] = useState<boolean>(false);
    const { data: employees, isLoading, refetch } = useGetAllEmployeesQuery();
    const [searchTerm, setSearchTerm] = useState("");
    const [editEmployee, setEditEmployee] = useState(false);
    const [editEmployeeId, setEditEmployeeId] = useState<string | null>(null);

    const filteredEmployees = employees?.users?.filter((employee) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            employee.name.toLowerCase().includes(searchLower) ||
            employee.email.toLowerCase().includes(searchLower) ||
            employee?.department?.name.toLowerCase().includes(searchLower) ||
            employee?.leavePolicy?.name.toLowerCase().includes(searchLower)
        );
    });


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
        }
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
            }).unwrap()
                .then((res) => {
                    toast({
                        title: 'Success',
                        description: 'Employee created successfully',
                        duration: 5000,
                        variant: 'success',
                    });

                    form.reset();
                }).catch((err) => {
                    console.log(err);
                    toast({
                        title: 'Error',
                        description: 'Something went wrong',
                        duration: 5000,
                        variant: 'destructive',
                    })
                });
            form.reset();
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
    return (<div>
        <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Manage Employees</h2>
            <div className="flex gap-2">
                <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        type="search"
                        placeholder="Search employees..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
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
            <CardContent className="p-0 mt-2">
                {isLoading ?

                    <div className="p-4">
                        <Loader className="w-[40px] h-[40p] m-auto " />
                    </div>
                    :
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
                            {filteredEmployees?.map((employee) => (
                                <TableRow key={employee.id}>
                                    <TableCell className="font-medium">{employee.name}</TableCell>
                                    <TableCell>{employee.email}</TableCell>
                                    <TableCell>{employee?.department?.name.toUpperCase()}</TableCell>
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
                                    <TableCell>
                                        <div className="flex space-x-2">
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
                                                    setEditEmployeeId(employee.id);
                                                }}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>}

            </CardContent>
        </Card>
    </div>)
}
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
});
type EmployeeFormValues = z.infer<typeof employeeSchema>;

