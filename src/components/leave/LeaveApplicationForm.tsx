import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Upload, AlertCircle, Info, } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import {
  useGetEmployeeLeavePolicyQuery,
  useValidateLeaveTypeByDaysQuery,
  useValidateLeaveTypeQuery,
  useApplyLeaveMutation,
  useGetAllHolidaysQuery
} from "@/features/api";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  leaveType: z.string({
    required_error: "Please select a leave type",
  }),
  startDate: z.date({
    required_error: "Please select a start date",
  }),
  endDate: z.date({
    required_error: "Please select an end date",
  }),
  isHalfDay: z.boolean().default(false),
  isMorning: z.boolean().optional(),
  reason: z
    .string()
    .min(5, { message: "Reason must be at least 5 characters long" })
    .optional()
    .nullable(),
  documents: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type LeaveType = {
  value: string;
  label: string;
  requiresReason: boolean;
};
const LeaveApplicationForm = () => {
  const { data: holidays } = useGetAllHolidaysQuery()
  const [showHalfDayOptions, setShowHalfDayOptions] = useState(false);
  const [documentFiles, setDocumentFiles] = useState<File[]>([]);
  const [selecteLeaveType, setSelectedLeaveType] = useState<LeaveType | null>(null);
  const [durationDays, setDurationDays] = useState<number | null>(null);
  const [applyLeaveApplication, applyLeaveStates] = useApplyLeaveMutation();
  const { data: validateLeave } = useValidateLeaveTypeQuery({ type: selecteLeaveType?.value?.toUpperCase() }, {
    skip: !selecteLeaveType?.value,
    refetchOnMountOrArgChange: true,
  });
  const { data: validateLeaveByDays } = useValidateLeaveTypeByDaysQuery({ type: selecteLeaveType?.value?.toUpperCase(), days: durationDays }, {
    skip: !selecteLeaveType?.value || !durationDays,
    refetchOnMountOrArgChange: true,
  });
  const navigate = useNavigate();

  const { data: leavePolicy } = useGetEmployeeLeavePolicyQuery();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isHalfDay: false,
      isMorning: true,
    },
  });

  const leaveType = form.watch("leaveType");
  const isHalfDay = form.watch("isHalfDay");
  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");

  const leaveTypes: LeaveType[] = [
    {
      value: "annual",
      label: "Annual Leave",
      requiresReason: true,
    },
    {
      value: "sick",
      label: "Sick Leave",
      requiresReason: true,
    },
    {
      value: "personal",
      label: "Personal Leave",
      requiresReason: true,
    },
    {
      value: "maternity",
      label: "Maternity Leave",
      requiresReason: true,
    },
    {
      value: "paternity",
      label: "Paternity Leave",
      requiresReason: true,
    },
    {
      value: "unpaid",
      label: "Unpaid Leave",
      requiresReason: true,
    },
    {
      value: "other",
      label: "Other",
      requiresReason: true,
    }
  ]

  // Calculate duration in days
  const calculateDuration = () => {
    if (!startDate || !endDate) return null;
    if (isHalfDay) return 0.5;

    let diffDays = 0;
    const currentDate = new Date(startDate);
    const endDateTime = new Date(endDate);

    while (currentDate <= endDateTime) {
      // Skip weekends (0 = Sunday, 6 = Saturday)
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        diffDays++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return diffDays;
  };

  //  I need when form changed the leave type
  useEffect(() => {
    form.watch((data) => {
      if (data.leaveType) {
        setSelectedLeaveType(leaveTypes.find((type) => type.value === data.leaveType) || null);
      }
    })
    setDurationDays(calculateDuration() > 1 ? calculateDuration() : null);
  }, [form, calculateDuration()]);

  const duration = calculateDuration();
  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };
  // Require documents for sick leave over 2 days
  const requiresDocuments =
    leavePolicy?.leave_policy?.requiresDocumentation ||
    (leaveType === "sick" && duration && duration > 2);

  // Toggle half-day options visibility
  const handleHalfDayChange = (checked: boolean) => {
    setShowHalfDayOptions(checked);
    form.setValue("isHalfDay", checked);
    // If it's half day, set end date same as start date
    if (checked && startDate) {
      form.setValue("endDate", startDate);
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setDocumentFiles(prev => [...prev, ...fileArray]);
      form.setValue("documents", fileArray);
    }
  };

  // Remove a selected file
  const removeFile = (index: number) => {
    const newFiles = [...documentFiles];
    newFiles.splice(index, 1);
    setDocumentFiles(newFiles);
    form.setValue("documents", newFiles.length > 0 ? newFiles : undefined);
  };

  const onSubmit = async (data: FormValues) => {
    if (!validateLeave?.leave_validation || (!validateLeaveByDays?.leave_validation.isValid && !isHalfDay)) {
      toast({
        title: "Leave request failed",
        description: "You cannot apply for this leave type.",
      });
      return;
    }
    if (applyLeaveStates.isLoading) {
      return;
    }
    const formData = new FormData();
    const formattedEndDate = new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(endDate);
    const formattedStartDate = new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(startDate);
    formData.append("startDate", formattedStartDate);
    formData.append("endDate", formattedEndDate);
    formData.append("leaveType", data.leaveType.toUpperCase());
    formData.append("isHalfDay", isHalfDay && isHalfDay ? "true" : "false");
    formData.append("isMorning", data.isMorning ? "true" : "false");
    formData.append("reason", data.reason || "");
    formData.append("status", "PENDING");
    if (data.documents) {
      for (const file of data.documents) {
        formData.append("documents", file);
      }
    }
    applyLeaveApplication(formData).unwrap().then(res => {
      toast({
        title: "Leave request submitted",
        description: "Your leave request has been submitted for approval.",
        variant: "success",
      });
      setDocumentFiles([]);
      form.reset();
      navigate('/leave-history')

    }).catch(err => {
      console.log(err, "err");
      // I need if error is 400 the fomat or set error to 
      if (err.status === 400) {
        err?.errors?.map((error: any) => {
          form.setError(error.field, {
            message: error?.defaultMessage,
          });
        })
        toast({
          title: "Leave request failed",
          description: err?.data?.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Leave request failed",
          description: err?.data?.message,
          variant: "destructive",
        });
      }


    })
  };

  // Ensure end date is not before start date
  useEffect(() => {
    if (startDate && endDate && endDate < startDate) {
      form.setValue("endDate", startDate);
    }

    // If it's half day, force end date to be same as start date
    if (isHalfDay && startDate) {
      form.setValue("endDate", startDate);
    }
  }, [startDate, endDate, isHalfDay, form]);

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Leave Details</h3>
              <Separator />

              <FormField
                control={form.control}
                name="leaveType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Leave Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a leave type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {leaveTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label.toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the type of leave you are requesting
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {validateLeave?.leave_validation && !validateLeave?.leave_validation && (
                <div className="p-3 bg-blue-50 text-red-800 rounded-md flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  <span className="font-medium text-sm">
                    {validateLeave?.message}
                  </span>
                </div>
              )}

              {leaveType && leavePolicy?.leave_policy?.description && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Leave Policy</AlertTitle>
                  <AlertDescription>
                    {leavePolicy?.leave_policy?.description}
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
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
                                format(field.value, "PPP")
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
                            onSelect={field.onChange}

                            modifiers={{
                              holidays: holidays?.holidays?.map((holiday) => new Date(holiday.date))
                            }}
                            modifiersClassNames={{
                              holidays: "bg-red-500 text-white",
                            }}
                            disabled={(date) => {
                              // Disable dates before today + min days before request
                              const minDate = new Date();
                              minDate.setDate(minDate.getDate() + leavePolicy?.leave_policy?.minDaysBeforeRequest || 0);
                              if (!validateLeave?.leave_validation) {
                                return true;
                              }
                              if (isWeekend(date)) {
                                return true;
                              }
                              return date < minDate;
                            }}
                            initialFocus
                            className="p-3 pointer-events-auto"
                            components={{
                              DayContent: ({ date }) => {
                                const holiday = holidays?.holidays?.find(
                                  (h) => new Date(h.date).toDateString() === date.toDateString()
                                );
                                return (
                                  <div className="relative group">
                                    {date.getDate()}
                                    {holiday && (
                                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        {holiday.name}
                                      </div>
                                    )}
                                  </div>
                                );
                              },
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      {leavePolicy?.leave_policy?.minDaysBeforeRequest > 0 && (
                        <FormDescription>
                          Must be requested at least {leavePolicy?.leave_policy?.minDaysBeforeRequest} days in advance
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild disabled={isHalfDay}>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                                isHalfDay && "opacity-70 cursor-not-allowed"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
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
                            onSelect={field.onChange}
                            disabled={(date) => {
                              // Disabled if no start date or if date is before start date
                              const minDate = new Date();
                              minDate.setDate(minDate.getDate() + leavePolicy?.leave_policy?.minDaysBeforeRequest || 0);
                              if (!validateLeave?.leave_validation) {
                                return true;
                              }
                              if (isWeekend(date)) {
                                return true;
                              }
                              return (
                                !startDate ||
                                date < minDate ||
                                (startDate && date < startDate)
                              );
                            }}
                            initialFocus
                            modifiers={{
                              holidays: holidays?.holidays?.map((holiday) => new Date(holiday.date))
                            }}
                            modifiersClassNames={{
                              holidays: "bg-red-500 text-white",
                            }}
                            className="p-3 pointer-events-auto"
                            components={{
                              DayContent: ({ date }) => {
                                const holiday = holidays?.holidays?.find(
                                  (h) => new Date(h.date).toDateString() === date.toDateString()
                                );
                                return (
                                  <div className="relative group">
                                    {date.getDate()}
                                    {holiday && (
                                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        {holiday.name}
                                      </div>
                                    )}
                                  </div>
                                );
                              },
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {duration && (
                <div className="p-3 bg-blue-50 text-blue-800 rounded-md flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  <span className="font-medium text-sm">
                    Leave Duration: {duration} {duration === 1 ? 'day' : 'days'}
                    {
                      !isHalfDay && !validateLeaveByDays?.leave_validation?.isValid && (
                        <span className="font-medium text-sm">

                          {` but you have ${validateLeaveByDays?.leave_validation?.balance} days left`}
                        </span>
                      )
                    }
                  </span>
                </div>
              )}
              {
                validateLeaveByDays && !isHalfDay && !validateLeaveByDays?.leave_validation?.isValid && (
                  <div className="p-3 bg-red-50 text-red-800 rounded-md flex items-center">
                    <Info className="h-4 w-4 mr-2" />
                    <span className="font-medium text-sm">
                      {validateLeaveByDays?.message}
                    </span>
                  </div>
                )}


              <FormField
                control={form.control}
                name="isHalfDay"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Half Day</FormLabel>
                      <FormDescription>
                        Request for half day leave
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={handleHalfDayChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {showHalfDayOptions && (
                <FormField
                  control={form.control}
                  name="isMorning"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Half Day Preference</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value === "morning")}
                        defaultValue={field.value ? "morning" : "afternoon"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select half day preference" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="morning">Morning Half (8am-12pm)</SelectItem>
                          <SelectItem value="afternoon">Afternoon Half (1pm-5pm)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormLabel>
                        Reason {selecteLeaveType?.requiresReason && <span className="text-red-500">*</span>}
                      </FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {!showHalfDayOptions
                                ? "A reason is required for this leave type"
                                : "Optional but recommended"
                              }
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder="Please provide a reason for your leave request"
                        className="resize-none"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      This information will be visible to your manager
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {(requiresDocuments) && (
                <FormField
                  control={form.control}
                  name="documents"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel>
                          Supporting Documents {!showHalfDayOptions && <span className="text-red-500">*</span>}
                        </FormLabel>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{leaveType === "sick" && duration && duration > 2
                                ? "Medical certificate required for sick leave over 2 days"
                                : "Supporting documentation required for this leave type"
                              }</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <FormControl>
                        <div className="flex flex-col space-y-3">
                          <div className="flex items-center justify-center w-full">
                            <label
                              htmlFor="dropzone-file"
                              className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                            >
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-3 text-gray-500" />
                                <p className="mb-2 text-sm text-gray-500">
                                  <span className="font-semibold">
                                    Click to upload
                                  </span>{" "}
                                  or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">
                                  PDF, JPG, PNG (MAX. 10MB)
                                </p>
                              </div>
                              <Input
                                id="dropzone-file"
                                type="file"
                                className="hidden"
                                onChange={handleFileChange}
                                multiple
                                accept=".pdf,.jpg,.jpeg,.png"
                              />
                            </label>
                          </div>

                          {/* Display selected files */}
                          {documentFiles.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-sm font-medium">Selected files:</p>
                              <ul className="space-y-1">
                                {documentFiles.map((file, index) => (
                                  <li key={index} className="flex items-center justify-between text-sm border rounded p-2">
                                    <span className="truncate">{file.name}</span>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-red-500"
                                      onClick={() => removeFile(index)}
                                    >
                                      <AlertCircle className="h-4 w-4" />
                                    </Button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Upload any supporting documents (medical certificates, etc.)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button">Cancel</Button>
              <Button
                type="submit"
                disabled={applyLeaveStates?.isLoading || !validateLeave?.leave_validation || (!validateLeaveByDays?.leave_validation?.isValid && !isHalfDay)}
              >
                {applyLeaveStates?.isLoading ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LeaveApplicationForm;
