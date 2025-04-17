
import { useState } from "react";
import { format, parse } from "date-fns";
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
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus, Edit, Trash } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Holiday } from "@/types";

const HolidayManager = () => {
  // Mock holidays data
  const [holidays, setHolidays] = useState<Holiday[]>([
    {
      id: "1",
      name: "New Year's Day",
      date: new Date(2025, 0, 1),
      isRestricted: true,
    },
    {
      id: "2",
      name: "Martin Luther King Jr. Day",
      date: new Date(2025, 0, 20),
      isRestricted: true,
    },
    {
      id: "3",
      name: "Memorial Day",
      date: new Date(2025, 4, 26),
      isRestricted: true,
    },
    {
      id: "4",
      name: "Independence Day",
      date: new Date(2025, 6, 4),
      isRestricted: true,
    },
    {
      id: "5",
      name: "Labor Day",
      date: new Date(2025, 8, 1),
      isRestricted: true,
    },
    {
      id: "6",
      name: "Thanksgiving Day",
      date: new Date(2025, 10, 27),
      isRestricted: true,
    },
    {
      id: "7",
      name: "Christmas Day",
      date: new Date(2025, 11, 25),
      isRestricted: true,
    },
  ]);

  const [newHoliday, setNewHoliday] = useState<Partial<Holiday>>({
    name: "",
    date: new Date(),
    isRestricted: true,
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveHoliday = () => {
    if (!newHoliday.name) {
      toast({
        title: "Error",
        description: "Please enter a holiday name",
        variant: "destructive",
      });
      return;
    }

    if (isEditing && newHoliday.id) {
      // Update existing holiday
      setHolidays(holidays.map(holiday =>
        holiday.id === newHoliday.id ? { ...holiday, ...newHoliday } as Holiday : holiday
      ));

      toast({
        title: "Holiday updated",
        description: `${newHoliday.name} has been updated`,
      });
    } else {
      // Add new holiday
      const id = Math.random().toString(36).substr(2, 9);
      setHolidays([...holidays, { ...newHoliday, id } as Holiday]);

      toast({
        title: "Holiday added",
        description: `${newHoliday.name} has been added to the calendar`,
      });
    }

    resetDialog();
  };

  const handleEdit = (holiday: Holiday) => {
    setNewHoliday(holiday);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setHolidays(holidays.filter(holiday => holiday.id !== id));
    toast({
      title: "Holiday deleted",
      description: "The holiday has been removed from the calendar",
    });
  };

  const resetDialog = () => {
    setDialogOpen(false);
    setNewHoliday({
      name: "",
      date: new Date(),
      isRestricted: true,
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Holiday Calendar</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setIsEditing(false);
              setNewHoliday({
                name: "",
                date: new Date(),
                isRestricted: true,
              });
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Holiday
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit Holiday" : "Add New Holiday"}</DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Update the holiday details below."
                  : "Add a new holiday to the company calendar."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm">Name</label>
                <Input
                  className="col-span-3"
                  placeholder="Holiday name"
                  value={newHoliday.name || ""}
                  onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm">Date</label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newHoliday.date ? format(newHoliday.date, "PPP") : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newHoliday.date}
                        onSelect={(date) => date && setNewHoliday({ ...newHoliday, date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm">Restricted</label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch
                    checked={newHoliday.isRestricted || false}
                    onCheckedChange={(checked) => setNewHoliday({ ...newHoliday, isRestricted: checked })}
                  />
                  <span className="text-sm text-muted-foreground">
                    {newHoliday.isRestricted
                      ? "Leave cannot be taken on this date"
                      : "Leave can be taken on this date"}
                  </span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={resetDialog}>
                Cancel
              </Button>
              <Button onClick={handleSaveHoliday}>
                {isEditing ? "Update Holiday" : "Add Holiday"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Holiday Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {holidays.map((holiday) => (
              <TableRow key={holiday.id}>
                <TableCell className="font-medium">{holiday.name}</TableCell>
                <TableCell>{format(holiday.date, "PPP")}</TableCell>
                <TableCell>
                  {holiday.isRestricted ? (
                    <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                      Restricted
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                      Open
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(holiday)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(holiday.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default HolidayManager;
