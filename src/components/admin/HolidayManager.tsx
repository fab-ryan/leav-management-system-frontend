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
import { Edit, Plus, Loader, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useCreateHolidayMutation, useDeleteHolidayMutation, useGetAllHolidaysQuery, useUpdateHolidayMutation } from '@/features/api';

const holidaySchema = z.object({
  name: z.string().min(1, 'Holiday name is required'),
  date: z.date({
    required_error: "Please select a date",
  }),
  isRecurring: z.boolean().default(false),
  isRestricted: z.boolean().default(false),
  restrictionReason: z.string().optional(),
});

type HolidayValue = z.infer<typeof holidaySchema> & { id?: string };



export const HolidayManager = () => {

  const [isAddDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [editingHoliday, setEditingHoliday] = useState<boolean>(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [isRestricted, setIsRestricted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const { data: holidays, isLoading } = useGetAllHolidaysQuery()
  const [postCreateHoliday, postCreateHolidayState] = useCreateHolidayMutation()

  const [
    updateHoliday,
    updateHolidayState,
  ] = useUpdateHolidayMutation()
  const [deleteHoliday, deleteHolidayState] = useDeleteHolidayMutation()

  const form = useForm<HolidayValue>({
    resolver: zodResolver(holidaySchema),
    defaultValues: {
      name: "",
      date: new Date(),
      isRecurring: false,
      isRestricted: false,
      restrictionReason: "",
    }
  });
  const formattedDate = (date: Date) => new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
  const handleAddHoliday = (data: HolidayValue) => {

    if (postCreateHolidayState.isLoading) return


    const payload = {
      name: data.name,
      date: formattedDate(data.date),
      recurring: data.isRecurring,
      restricted: data.isRestricted,
      restrictionReason: data?.restrictionReason ?? null,
    }
    postCreateHoliday(payload)
      .unwrap()
      .then((response) => {
        setAddDialogOpen(false);
        form.reset();
        toast({
          title: "Success",
          description: "Holiday has been created",
          variant: "default",
        });
      })
      .catch((error) => {
        console.error("Error creating holiday:", error);
        toast({
          title: "Error",
          description: "Failed to create holiday",
          variant: "destructive",
        });
      });
  };

  const handleUpdateHoliday = (data: HolidayValue) => {
    if (updateHolidayState.isLoading) return
    const payload = {
      name: data.name,
      date: formattedDate(data.date),
      recurring: data.isRecurring,
      restricted: data.isRestricted,
      restrictionReason: data?.restrictionReason ?? null,
    }
    updateHoliday({ id: selectedId, data: payload })
      .unwrap()
      .then((response) => {
        setAddDialogOpen(false);
        form.reset();
        toast({
          title: "Success",
          description: "Holiday has been updated",
          variant: "default",
        });
      })
      .catch((error) => {
        console.error("Error updating holiday:", error);
        toast({
          title: "Error",
          description: "Failed to update holiday",
          variant: "destructive",
        });
      });
    setEditingHoliday(false);
    setSelectedId(undefined);
  };

  const handleDeleteHoliday = (id: string) => {
    if (deleteHolidayState.isLoading) return
    deleteHoliday(id)
      .unwrap()
      .then((response) => {
        toast({
          title: "Success",
          description: "Holiday has been deleted",
          variant: "default",
        });
      })
      .catch((error) => {
        console.error("Error deleting holiday:", error);
        toast({
          title: "Error",
          description: "Failed to delete holiday",
          variant: "destructive",
        });
      });
    setEditingHoliday(false);
    setAddDialogOpen(false);
    form.reset();
  };

  const openEditDialog = (data: any) => {
    setEditingHoliday(true);
    form.setValue("name", data?.name);
    form.setValue("date", new Date(data?.date));
    form.setValue("isRecurring", data?.recurring);
    form.setValue("isRestricted", data?.restricted);
    form.setValue("restrictionReason", data?.restrictionReason);
    setIsRecurring(data?.recurring);
    setIsRestricted(data?.restricted);
    setSelectedDate(new Date(data?.date));
    setAddDialogOpen(true);
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Holidays</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => form.reset()} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Holiday
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] w-[95vw]">
            <DialogHeader>
              <DialogTitle>{editingHoliday ? 'Edit Holiday' : 'Add New Holiday'}</DialogTitle>
              <DialogDescription>
                {editingHoliday ? 'Update the holiday details' : 'Create a new holiday'}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(editingHoliday ? handleUpdateHoliday : handleAddHoliday)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Holiday Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter holiday name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date);
                          field.onChange(date);
                        }}
                        className="rounded-md border"
                        modifiers={{
                          holidays: holidays?.holidays?.map((holiday) => new Date(holiday.date))
                        }}
                        modifiersClassNames={{
                          holidays: "bg-red-500 text-white",
                        }}
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isRecurring"
                    checked={isRecurring}
                    onCheckedChange={(checked) => {
                      setIsRecurring(checked);
                      form.setValue("isRecurring", checked);
                    }}
                  />
                  <label htmlFor="isRecurring" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Recurring Holiday
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isRestricted"
                    checked={isRestricted}
                    onCheckedChange={(checked) => {
                      setIsRestricted(checked);
                      form.setValue("isRestricted", checked);
                    }}
                  />
                  <label htmlFor="isRestricted" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Restricted Holiday
                  </label>
                </div>
                {isRestricted && (
                  <FormField
                    control={form.control}
                    name="restrictionReason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Restriction Reason</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter restriction reason" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setAddDialogOpen(false);
                    setEditingHoliday(false);
                    form.reset();
                  }}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={postCreateHolidayState.isLoading || updateHolidayState.isLoading}>
                    {postCreateHolidayState.isLoading || updateHolidayState.isLoading ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        {editingHoliday ? 'Updating' : 'Creating'}...
                      </>
                    ) : (
                      editingHoliday ? 'Update' : 'Save'
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Holiday Name</TableHead>
                  <TableHead className="min-w-[120px]">Date</TableHead>
                  <TableHead className="min-w-[100px]">Type</TableHead>
                  <TableHead className="min-w-[150px]">Restrictions</TableHead>
                  <TableHead className="min-w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                  isLoading && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        <div className="flex items-center justify-center p-4">
                          <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                }
                {
                  holidays?.holidays.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        <div className="p-4">
                          No holidays found
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                }
                {holidays?.holidays.map((holiday) => (
                  <TableRow key={holiday.id}>
                    <TableCell className="font-medium">{holiday.name}</TableCell>
                    <TableCell>{format(holiday.date, 'PPP')}</TableCell>
                    <TableCell>
                      <div className={`p-1 rounded text-center ${holiday.recurring ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'
                        }`}>
                        {holiday.recurring ? 'Recurring' : 'One-time'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {holiday.restricted ? (
                        <div className="p-1 bg-red-500 text-white rounded text-center">
                          {holiday?.restrictionReason}
                        </div>
                      ) : (
                        <div className="p-1 bg-green-500 text-white rounded text-center">
                          No Restrictions
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            openEditDialog(holiday);
                            setSelectedId(holiday.id);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => { handleDeleteHoliday(holiday.id); setSelectedId(holiday.id); }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
