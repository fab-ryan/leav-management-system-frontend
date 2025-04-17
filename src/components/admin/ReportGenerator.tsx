
import { useState } from "react";
import { format, subMonths } from "date-fns";
import { Calendar as CalendarIcon, Download, BarChart4, Users, Calendar } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { toast } from "@/hooks/use-toast";

// Mock data for departmental report
const departmentData = [
  { department: "Engineering", annual: 62, sick: 12, personal: 8, total: 82 },
  { department: "Design", annual: 45, sick: 15, personal: 6, total: 66 },
  { department: "Marketing", annual: 38, sick: 8, personal: 4, total: 50 },
  { department: "HR", annual: 25, sick: 10, personal: 3, total: 38 },
  { department: "Executive", annual: 30, sick: 5, personal: 3, total: 38 },
];

// Mock data for monthly report
const monthlyData = [
  { month: "Jan", annual: 15, sick: 8, personal: 2 },
  { month: "Feb", annual: 18, sick: 10, personal: 3 },
  { month: "Mar", annual: 20, sick: 12, personal: 4 },
  { month: "Apr", annual: 25, sick: 8, personal: 3 },
  { month: "May", annual: 30, sick: 6, personal: 2 },
  { month: "Jun", annual: 40, sick: 4, personal: 3 },
  { month: "Jul", annual: 45, sick: 3, personal: 2 },
  { month: "Aug", annual: 38, sick: 5, personal: 3 },
  { month: "Sep", annual: 30, sick: 7, personal: 2 },
  { month: "Oct", annual: 25, sick: 9, personal: 3 },
  { month: "Nov", annual: 20, sick: 11, personal: 4 },
  { month: "Dec", annual: 15, sick: 12, personal: 5 },
];

// Mock data for individual report
const individualData = [
  { name: "John Doe", department: "Engineering", annual: 12, sick: 3, personal: 1 },
  { name: "Jane Smith", department: "Design", annual: 8, sick: 2, personal: 2 },
  { name: "Mike Johnson", department: "Marketing", annual: 15, sick: 1, personal: 0 },
  { name: "Sarah Williams", department: "HR", annual: 10, sick: 0, personal: 3 },
  { name: "David Brown", department: "Executive", annual: 5, sick: 1, personal: 0 },
];

const ReportGenerator = () => {
  const [dateRange, setDateRange] = useState<"current" | "last" | "custom">("current");
  const [startDate, setStartDate] = useState<Date>(subMonths(new Date(), 1));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [reportType, setReportType] = useState("summary");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  
  const handleGenerateReport = () => {
    toast({
      title: "Report Generated",
      description: "Your report has been generated successfully",
    });
  };
  
  const handleExportReport = (format: "pdf" | "excel" | "csv") => {
    toast({
      title: `Export to ${format.toUpperCase()}`,
      description: `Report has been exported to ${format.toUpperCase()} format`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start flex-col sm:flex-row gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Leave Reports</h2>
          <p className="text-muted-foreground">
            Generate and export leave usage reports
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select defaultValue={dateRange} onValueChange={(value: any) => setDateRange(value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Year</SelectItem>
              <SelectItem value="last">Last Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          
          {dateRange === "custom" && (
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[160px] justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PP") : "Start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[160px] justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PP") : "End date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => date && setEndDate(date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
          
          <Button onClick={handleGenerateReport}>
            Generate Report
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Annual Leave Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">64%</div>
            <p className="text-xs text-muted-foreground">
              Percentage of annual leave used by employees
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sick Leave Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38%</div>
            <p className="text-xs text-muted-foreground">
              Percentage of sick leave used by employees
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Days Off</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">452</div>
            <p className="text-xs text-muted-foreground">
              Total days of leave taken across organization
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle>Leave Usage Report</CardTitle>
            <div className="flex gap-2">
              <Select defaultValue={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                  <SelectItem value="executive">Executive</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => handleExportReport("pdf")}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
          <CardDescription>
            Overview of leave usage across departments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="chart" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="chart" onClick={() => setReportType("summary")}>
                <BarChart4 className="h-4 w-4 mr-2" />
                Chart View
              </TabsTrigger>
              <TabsTrigger value="department" onClick={() => setReportType("department")}>
                <Users className="h-4 w-4 mr-2" />
                Department
              </TabsTrigger>
              <TabsTrigger value="individual" onClick={() => setReportType("individual")}>
                <Calendar className="h-4 w-4 mr-2" />
                Individual
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="chart" className="space-y-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="annual" name="Annual Leave" fill="#3b82f6" />
                    <Bar dataKey="sick" name="Sick Leave" fill="#ef4444" />
                    <Bar dataKey="personal" name="Personal Leave" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="department">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Department</TableHead>
                      <TableHead>Annual Leave</TableHead>
                      <TableHead>Sick Leave</TableHead>
                      <TableHead>Personal Leave</TableHead>
                      <TableHead>Total Days</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {departmentData.map((dept) => (
                      <TableRow key={dept.department}>
                        <TableCell className="font-medium">{dept.department}</TableCell>
                        <TableCell>{dept.annual} days</TableCell>
                        <TableCell>{dept.sick} days</TableCell>
                        <TableCell>{dept.personal} days</TableCell>
                        <TableCell className="font-medium">{dept.total} days</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="individual">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Annual Leave</TableHead>
                      <TableHead>Sick Leave</TableHead>
                      <TableHead>Personal Leave</TableHead>
                      <TableHead>Total Days</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {individualData.map((emp) => (
                      <TableRow key={emp.name}>
                        <TableCell className="font-medium">{emp.name}</TableCell>
                        <TableCell>{emp.department}</TableCell>
                        <TableCell>{emp.annual} days</TableCell>
                        <TableCell>{emp.sick} days</TableCell>
                        <TableCell>{emp.personal} days</TableCell>
                        <TableCell className="font-medium">{emp.annual + emp.sick + emp.personal} days</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <div className="flex justify-end gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportReport("csv")}
            >
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportReport("excel")}
            >
              Excel
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportReport("pdf")}
            >
              PDF
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ReportGenerator;
