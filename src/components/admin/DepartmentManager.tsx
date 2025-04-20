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
import { Edit, Plus, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { useGetAllDepartmentsQuery,useCreateDepartmentMutation,useUpdateDepartmentMutation,useUpdateStatusMutation } from '@/features/api';

const departmentSchema = z.object({
    name: z.string().min(1, 'Department name is required'),
    description: z.string().optional(),
    isPublic: z.boolean().default(true)
});

type DepartmentValue = z.infer<typeof departmentSchema> & { id?: string };


export const DepartmentManager = () => {
    const [isAddDialogOpen, setAddDialogOpen] = useState<boolean>(false);
    const [editingDepartment, setEditingDepartment] = useState<boolean>(false);
    const [selectId,setSelectId]=useState<string | null>(null);
    const [isPublic, setIsPublic] = useState(true);
    const { isLoading, data:departmentsData,refetch } = useGetAllDepartmentsQuery();
    const [postDepartment,postDepartmentState]=useCreateDepartmentMutation();
    const [updateDepartment,updateDepartmentState]=useUpdateDepartmentMutation();
    const [updateStatus,updateStatusState]=useUpdateStatusMutation();

    useEffect(() => {
            if(isLoading) return;
            if(postDepartmentState.isSuccess){
               refetch() 
            }
            if(updateDepartmentState.isSuccess){
               refetch()
            }
            if(updateStatusState.isSuccess){
               refetch()
            }
    },[postDepartmentState,updateDepartmentState,refetch,updateStatusState])
    const form = useForm<DepartmentValue>({
        resolver: zodResolver(departmentSchema),
        defaultValues: {
            name: "",
            description: "",
            isPublic: true
        }
    });

    const handleAddDepartment = (data: DepartmentValue) => {
        if(postDepartmentState.isLoading){
            return;
        }
        postDepartment({
            name:data.name,
            description:data.description,
            isPublic:data.isPublic
        }).unwrap()
        .then((data)=>{
            toast({
                title: "Success",
                description: "Department has been created",
                variant: "default",
            });
               setAddDialogOpen(false);
            form.reset();
        })
        .catch((error)=>{

            toast({
                title: "Error",
                description: error?.data?.message ?? "Something went wrong",
                variant: "destructive",
            });
        })
    };

    const handleUpdateDepartment = (data: DepartmentValue) => {
      if(updateDepartmentState.isLoading) return;
        updateDepartment({
            id:selectId,
            data:{
            name:data.name,
            description:data.description,
            isPublic:data.isPublic
        }}).unwrap()
        .then((data)=>{
            toast({
                title: "Success",
                description: "Department has been updated",
                variant: "default",
            });
            setAddDialogOpen(false);
            setEditingDepartment(false);
            form.reset();
        })
        .catch((error)=>{
            console.log(error);
            toast({
                title: "Error",
                description: error?.data?.message ?? "Something went wrong",
                variant: "destructive",
            })
        })
       
    };

    const openEditDialog = (data: any) => {
        setEditingDepartment(true);
        form.setValue("name", data?.name);
        form.setValue("description", data?.description);
        form.setValue("isPublic", data?.isPublic);
        setIsPublic(data?.isPublic);
        setSelectId(data?.id);
        setAddDialogOpen(true);
    };

    const handleTogglePublic = (id: string, currentStatus: boolean) => {
       if(updateStatusState.isLoading) return;
        updateStatus({
            id,
        }).unwrap()
        .then((data)=>{
            toast({
                title: "Success",
                description: `Department has been ${!currentStatus ? 'made public' : 'made private'}`,
                variant: "default",
            });
        })
        .catch((error)=>{
            console.log(error);
        })
        

    };
  

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Departments</h2>
                <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => form.reset()}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Department
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>{editingDepartment ? 'Edit Department' : 'Add New Department'}</DialogTitle>
                            <DialogDescription>
                                {editingDepartment ? 'Update the department details' : 'Create a new department'}
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(editingDepartment ? handleUpdateDepartment : handleAddDepartment)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Department Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter department name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter department description" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="isPublic"
                                        checked={isPublic}
                                        onCheckedChange={(checked) => {
                                            setIsPublic(checked);
                                            form.setValue("isPublic", checked);
                                        }}
                                    />
                                    <label htmlFor="isPublic" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Public Department
                                    </label>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => {
                                        setAddDialogOpen(false);
                                        setEditingDepartment(false);
                                        form.reset();
                                    }}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading ? (
                                            <>
                                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                                                {editingDepartment ? 'Updating' : 'Creating'}...
                                            </>
                                        ) : (
                                            editingDepartment ? 'Update' : 'Save'
                                        )}
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
                                <TableHead>Department Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {departmentsData?.departments?.map((department) => (
                                <TableRow key={department.id}>
                                    <TableCell className="font-medium">{department.name}</TableCell>
                                    <TableCell>{department.description}</TableCell>
                                    <TableCell>
                                        <div
                                            className={`p-1 rounded text-center cursor-pointer ${department.isPublic
                                                ? 'bg-green-500 text-white'
                                                : 'bg-gray-500 text-white'
                                                }`}
                                            onClick={() => handleTogglePublic(department.id, department.isPublic)}
                                        >
                                            {department.isPublic ? 'Public' : 'Private'}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => openEditDialog(department)}
                                            >
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
        </div>
    );
}; 