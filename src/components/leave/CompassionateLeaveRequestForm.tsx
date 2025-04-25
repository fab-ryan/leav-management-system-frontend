import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, Upload, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn, formatDateToApi } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { useGetAllHolidaysQuery, usePostCompassionateLeaveMutation } from "@/features/api";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
    date: z.date({
        required_error: "Please select a date",
    }),
    reason: z.string().min(10, {
        message: "Reason must be at least 10 characters long",
    }),
});

type FormValues = z.infer<typeof formSchema>;

const CompassionateLeaveRequestForm = ({ setIsRequestModalOpen }: { setIsRequestModalOpen: (value: boolean) => void }) => {
    const { data: holidays } = useGetAllHolidaysQuery();
    const [postCompassionateLeave, { isLoading }] = usePostCompassionateLeaveMutation();
    const navigate = useNavigate();
    const [isSelectedHoliday, setIsSelectedHoliday] = useState(false);
    const [isSelectedWeekend, setIsSelectedWeekend] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    // Function to check if a date is a weekend
    const isWeekend = (date: Date) => {
        const day = date.getDay();
        return day === 0 || day === 6;
    };

    // Function to check if a date is a holiday
    const isHoliday = (date: Date) => {
        return holidays?.holidays?.some(
            (holiday) => new Date(holiday.date).toDateString() === date.toDateString()
        );
    };
    const isNotRecurringHoliday = (date: Date) => {
        return holidays?.holidays?.some(
            (holiday) => new Date(holiday.date).toDateString() === date.toDateString() && !holiday.recurring
        );
    };


    const onSubmit = async (data: FormValues) => {
        if (isLoading) {
            toast({
                title: "Invalid date",
                description: "Please select a valid date",
                variant: "destructive",
            });
            return;
        }

        const compassionateLeaveData = {
            workDate: formatDateToApi(data.date.toISOString()),
            reason: data.reason,
            holiday: isSelectedHoliday,
            weekend: isSelectedWeekend,

        };
        postCompassionateLeave(compassionateLeaveData).unwrap().then((res) => {
            toast({
                title: "Compassionate leave request submitted",
                description: res?.message,
                variant: "success",
                duration: 5000

            });

            setIsRequestModalOpen(false);
        }).catch((err) => {
            toast({
                title: "Error",
                description: err?.data?.message,
                variant: "destructive",
                duration: 5000
            });
        });


    };

    return (
        <Card>
            <CardContent className="pt-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Compassionate Leave Details</h3>
                            <Separator />

                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            field.value.toLocaleDateString()
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={(date) => {
                                                        field.onChange(date);
                                                        setIsSelectedHoliday(isHoliday(date));
                                                        setIsSelectedWeekend(isWeekend(date));
                                                    }}
                                                    disabled={(date) => {
                                                        if (isNotRecurringHoliday(date)) {
                                                            return true;
                                                        }
                                                        return !isWeekend(date) && !isHoliday(date);
                                                    }}
                                                    modifiers={{
                                                        weekends: (date) => isWeekend(date),
                                                        holidays: (date) => isHoliday(date),
                                                    }}
                                                    modifiersClassNames={{
                                                        weekends: "bg-blue-100 text-blue-800",
                                                        holidays: "bg-red-500 text-white",
                                                    }}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormDescription>
                                            Only weekends and holidays are available for compassionate leave
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="reason"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Reason</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Please provide a detailed reason for your compassionate leave request"
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            This information will be visible to your manager
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                        </div>

                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" type="button" onClick={() => navigate('/leave-history')}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                Submit Request
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default CompassionateLeaveRequestForm;