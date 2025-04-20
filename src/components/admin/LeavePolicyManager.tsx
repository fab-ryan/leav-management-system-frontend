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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";


import { Edit, Plus, Loader, } from "lucide-react"
// import { format } from "path";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { Switch } from "../ui/switch";
import { useLeaveTypePoliciesQuery, useLeaveTypePolicyQuery, usePostLeaveTypPolicyMutation, useUpdateLeaveTypPolicyMutation, useUpdateLeaveStatusPolicyMutation } from "@/features/api";
import { toast } from "@/hooks/use-toast";

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
    const [selectLeavePolocyId,] = useState("");
    const [editingPolicy, setEditingPolicy] = useState<boolean>(false);
    const [requiresDocumentation, setRequiresDocumentation] = useState(true);
    const [requiresApproval, setRequiresApproval] = useState(true);

    const { isLoading: isLoadingLeavePolicy, data: leavePoliciesData, refetch: refetchPolicies } = useLeaveTypePoliciesQuery()
    const [addLeaves, leaveState] = usePostLeaveTypPolicyMutation()
    const [updateLeave, updatesLeaveState] = useUpdateLeaveTypPolicyMutation()
    const [updateLeaveStatus, updateLeaveStatusStates] = useUpdateLeaveStatusPolicyMutation()

    const { refetch } = useLeaveTypePolicyQuery({ id: selectLeavePolocyId }, {
        skip: true
    })

    useEffect(() => {
        if (leaveState.isSuccess) {
            refetchPolicies();
        }
    }, [leaveState.isSuccess, refetchPolicies]);

    useEffect(() => {
        if (updatesLeaveState.isSuccess) {
            refetchPolicies();
        }
    }, [updatesLeaveState.isSuccess, refetchPolicies]);

    useEffect(() => {
        if (updateLeaveStatusStates.isSuccess) {
            refetchPolicies();
        }
    }, [updateLeaveStatusStates.isSuccess, refetchPolicies]);

    useEffect(() => {
        if (selectLeavePolocyId) {
            refetch()
        }
    }, [selectLeavePolocyId])

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


    const openEditDialog = (data: any) => {
        setEditingPolicy(true);
        form.setValue("name", data?.name);
        form.setValue("annualLeave", data?.annualAllowance);
        form.setValue("sickLeave", data?.sickAllowance);
        form.setValue("personalLeave", data.personalAllowance);
        form.setValue("carryForward", data?.carryForwardLimit);
        form.setValue("noticePeriod", data?.minDaysBeforeRequest);
        form.setValue("description", data?.description);
        setRequiresApproval(data?.requiresApproval)
        setRequiresDocumentation(data?.requiresDocumentation)
        setAddPolicyDialog(true);
    };

    const handleAddPolicy = (data: LeavePolicyValue) => {
        if (leaveState.isLoading) return;
        addLeaves({
            data: {
                annualAllowance: data.annualLeave,
                description: data.description,
                name: data.name,
                sickAllowance: data.sickLeave,
                personalAllowance: data.personalLeave,
                carryForwardLimit: data.carryForward,
                requiresApproval: requiresApproval,
                requiresDocumentation,
                minDaysBeforeRequest: data.noticePeriod
            }
        }).unwrap().then(() => {
            toast({
                title: "Success",
                description: "Leave Policy has been created",
                variant: "default",
            });
            setAddPolicyDialog(false);
            form.reset();
        }).catch(error => {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to create leave policy",
                variant: "destructive",
            });
        });
    };

    const handleUpdatePolicy = (data: LeavePolicyValue) => {
        if (updatesLeaveState.isLoading) return;
        updateLeave({
            id: data.id,
            data: {
                annualAllowance: data.annualLeave,
                description: data.description,
                name: data.name,
                sickAllowance: data.sickLeave,
                personalAllowance: data.personalLeave,
                carryForwardLimit: data.carryForward,
                requiresApproval: requiresApproval,
                requiresDocumentation,
                minDaysBeforeRequest: data.noticePeriod
            }
        }).unwrap().then(() => {
            toast({
                title: "Success",
                description: "Leave Policy has been updated",
                variant: "default",
            });
            setAddPolicyDialog(false);
            setEditingPolicy(false);
            form.reset();
        }).catch(error => {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to update leave policy",
                variant: "destructive",
            });
        });
    };
    const handleUpdateStatus = ({ id, status }: { id: string, status: boolean }) => {
        if (updateLeaveStatusStates.isLoading) return;
        updateLeaveStatus({
            id, status
        }).unwrap().then(() => {
            toast({
                title: "Success",
                description: `Policy has been ${status ? 'activated' : 'deactivated'}`,
                variant: "default",
            });
        }).catch(error => {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to update policy status",
                variant: "destructive",
            });
        });
    }


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
                                    <div className="flex justify-start text-center">
                                        <label className="text-right text-sm text-bold">Requires Documentation</label>
                                        <div className="ml-4">
                                            <Switch
                                                checked={requiresDocumentation}
                                                onCheckedChange={(checked) => setRequiresDocumentation(checked)}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-start text-center">
                                        <label className="text-right text-sm text-bold">Requires Approval</label>
                                        <div className="ml-4">
                                            <Switch
                                                checked={requiresApproval}
                                                onCheckedChange={(checked) => setRequiresApproval(checked)}
                                            />
                                        </div>

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
                    {
                        isLoadingLeavePolicy ?
                            <div className="p-4">
                                <Loader className="w-[40px] h-[40p] m-auto " />
                            </div>
                            :
                            (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Policy Name</TableHead>
                                            <TableHead>Annual</TableHead>
                                            <TableHead>Sick</TableHead>
                                            <TableHead>Personal</TableHead>
                                            <TableHead>Carry Forward</TableHead>
                                            <TableHead>Notice Period</TableHead>
                                            <TableHead>Status</TableHead>
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
                                                <TableCell
                                                    onClick={() => handleUpdateStatus({ id: policy.id, status: !policy.isActive })}
                                                    className='cursor-pointer'
                                                >
                                                    {
                                                        policy.isActive ? <div className="p-1 bg-green-500 text-white rounded text-center">Active</div> : <div className="p-1 bg-red-500 text-white rounded text-center">In Active</div>
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => openEditDialog(policy)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )
                    }

                </CardContent>
            </Card>
        </div>
    )
}