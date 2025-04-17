import { useLeaveTypePoliciesQuery, useLeaveTypePolicyQuery } from "@/features/api";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";

import { Trash, Edit, Plus, } from "lucide-react"
// import { format } from "path";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { LeaveRequest } from "@/types";
import { Card, CardContent } from "../ui/card";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";

const leavePolicySchema = z.object({
    name: z.string().min(1, 'Policy name is required'),
    annualLeave: z.number().min(1, 'Annual leave must be 0 or greater'),
    sickLeave: z.number().min(1, 'Sick leave must be 0 or greater'),
    personalLeave: z.number().min(1, 'Personal leave must be 0 or greater'),
    carryForward: z.number().min(1, 'Carry forward must be 0 or greater'),
    noticePeriod: z.number().min(1, 'Notice period must be 0 or greater'),
    description: z.string()
});

type LeavePolicyValue = z.infer<typeof leavePolicySchema> & { id?: string };


export const LeavePolicy = () => {

    const [isAddDialogOpen, setAddPolicyDialog] = useState<boolean>(false);
    const [updatePolicyDialog, setUpdatePolicyDialog] = useState<boolean>(false);
    const [selectLeavePolocyId, setSelectedLeaveId] = useState("");
    const [editingPolicy, setEditingPolicy] = useState<boolean>(false);
    const [requestDetailOpen, setRequestDetailOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
    const { isLoading: isLoadingLeavePolicy, data: leavePoliciesData } = useLeaveTypePoliciesQuery()

    const { isLoading: isLoadingSingleLeavePolicy, refetch } = useLeaveTypePolicyQuery({ id: selectLeavePolocyId }, {
        skip: true
    })


    useEffect(() => {
        if (selectLeavePolocyId) {
            refetch()
        }
    }, [setSelectedLeaveId])

    const form = useForm<LeavePolicyValue>({
        resolver: zodResolver(leavePolicySchema),
        defaultValues: {
            name: "",
            annualLeave: 0,
            sickLeave: 0,
            personalLeave: 0,
            carryForward: 0,
            noticePeriod: 0,
            description: ""

        }
    })

    // Open request detail dialog
    const openRequestDetail = (request: LeaveRequest) => {
        setSelectedRequest(request);
        setRequestDetailOpen(true);
    };
    const openEditDialog = (data: any) => {
        setEditingPolicy(true);
        form.setValue("name", data?.name);
        form.setValue("annualLeave", data?.annualAllowance);
        form.setValue("sickLeave", data?.sickAllowance);
        form.setValue("personalLeave", data.personalAllowance);
        form.setValue("carryForward", data?.carryForwardLimit);
        form.setValue("noticePeriod", data?.minDaysBeforeRequest);
        form.setValue("description", data?.description);
        setAddPolicyDialog(true);
    };

    const handleAddPolicy = (data: LeavePolicyValue) => {
        // Add your API call here
        console.log('Adding policy:', data);
        setAddPolicyDialog(false);
        form.reset();
        // toast.success('Policy added successfully');
    };

    const handleUpdatePolicy = (data: LeavePolicyValue) => {
        // Add your API call here
        console.log('Updating policy:', data);
        setAddPolicyDialog(false);
        setEditingPolicy(false);
        form.reset();
        // toast.success('Policy updated successfully');
    };
    return (
        <div className="">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">Leave Policies</h2>
                <Dialog open={isAddDialogOpen} onOpenChange={setAddPolicyDialog}>
                    <DialogTrigger asChild>
                        <Button
                            onClick={() => form.reset()}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Policy
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>{editingPolicy ? 'Edit Policy' : 'Add New Policy'}</DialogTitle>
                            <DialogDescription>
                                {editingPolicy ? 'Update the leave policy' : 'Create a new leave policy for your organization'}
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(editingPolicy ? handleUpdatePolicy : handleAddPolicy)} className="space-y-4">
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Policy Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter policy name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="annualLeave"
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
                                            name="sickLeave"
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
                                            name="personalLeave"
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
                                            name="carryForward"
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
                                            name="noticePeriod"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Notice Period (days)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="Minimum days before"
                                                            {...field}
                                                            onChange={e => field.onChange(Number(e.target.value))}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        placeholder="Description of Policy"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => {
                                        setAddPolicyDialog(false);
                                        setEditingPolicy(false);
                                        form.reset();
                                    }}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">
                                        {editingPolicy ? 'Update' : 'Save'} Policy
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Policy Name</TableHead>
                                <TableHead>Annual</TableHead>
                                <TableHead>Sick</TableHead>
                                <TableHead>Personal</TableHead>
                                <TableHead>Carry Forward</TableHead>
                                <TableHead>Notice Period</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leavePoliciesData?.policies?.map((policy) => (
                                <TableRow key={policy.id}>
                                    <TableCell className="font-medium">{policy.name}</TableCell>
                                    <TableCell>{policy.annualAllowance} days</TableCell>
                                    <TableCell>{policy.sickAllowance} days</TableCell>
                                    <TableCell>{policy.personalAllowance} days</TableCell>
                                    <TableCell>{policy.carryForwardLimit} days max</TableCell>
                                    <TableCell>{policy.minDaysBeforeRequest} days</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => openEditDialog(policy)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete the policy.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => { }}>
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}