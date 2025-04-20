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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Loader, Pencil } from 'lucide-react';
import { useGetAllDepartmentsQuery, useUpdateProfileMutation, useUserProfileQuery } from '@/features/api';

const profileSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address').optional(),
    phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
    department: z.string().min(1, 'Department is required'),
    position: z.string().min(1, 'Position is required'),
    address: z.string().optional(),
    emergencyContact: z.object({
        phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
    }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const Profile = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [updateProfile, updateProfileState] = useUpdateProfileMutation();
    const { data: departmentsData, refetch } = useGetAllDepartmentsQuery();
    const { data: userProfile } = useUserProfileQuery();
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: '',
            email: '',
            phoneNumber: '',
            department: '',
            position: '',
            address: '',
            emergencyContact: {
                phoneNumber: '',
            },
        },
    });
    useEffect(() => {
        if (userProfile) {
            form.setValue('name', userProfile.employee.name);
            form.setValue('email', userProfile.employee.email);
            form.setValue('phoneNumber', userProfile.employee.phoneNumber);
            form.setValue('department', userProfile.employee.department?.id);
            form.setValue('address', userProfile.employee?.location);
            form.setValue('emergencyContact.phoneNumber', userProfile.employee?.emergencyPhoneNumber);
            form.setValue('position', userProfile.employee?.team);

        }
    }, [userProfile]);

    const onSubmit = async (data: ProfileFormValues) => {
        if (updateProfileState.isLoading) return;
        const payload = {
            name: data.name,
            email: data.email,
            phoneNumber: data.phoneNumber,
            departmentId: data.department,
            location: data.address,
            team: data.position,
            emergencyPhoneNumber: data.emergencyContact.phoneNumber,
        }
        updateProfile(payload).unwrap().then(() => {
            toast({
                title: "Success",
                description: "Profile has been updated successfully",
                variant: "default",
            });
            refetch();
        }).catch((error) => {
            toast({
                title: "Error",
                description: "Failed to update profile",
                variant: "destructive",
            });
        })

    };

    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader>
                    <CardTitle>
                        {userProfile?.employee.profileCompleted ? 'Update Your Profile' : 'Complete Your Profile'}
                        {
                            !userProfile?.employee.profileCompleted && (
                                <p className="text-sm text-gray-500 mt-3">
                                    Please complete your profile to continue
                                </p>
                            )
                        }
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                <FormField
                                    control={form.control}
                                    name="name"
                                    disabled={userProfile?.employee.profileCompleted}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your name" {...field}

                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    disabled={!userProfile?.employee.profileCompleted}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="Enter your email" {...field}
                                                    readOnly={true}
                                                    disabled={true}
                                                />
                                            </FormControl>
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
                                                <Input placeholder="Enter your phone number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="department"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Department</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select department" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {departmentsData?.departments
                                                        .filter(depart => depart?.isPublic)
                                                        .map((department) => (
                                                            <SelectItem key={department.id} value={department.id}>
                                                                {department.name}
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
                                    name="position"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Team</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your Team" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>Address</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Enter your address" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Emergency Contact</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    <FormField
                                        control={form.control}
                                        name="emergencyContact.phoneNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone Number</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter emergency contact phone number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Profile'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}; 