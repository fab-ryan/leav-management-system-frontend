
import { useState } from "react";
import { format, subMonths } from "date-fns";
import { Calendar as CalendarIcon, Download, BarChart4, Users, Calendar, PieChart } from "lucide-react";
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
import { useGetManagerDashboardQuery } from "@/features/api/dashboardApi";
import { useGetAllDepartmentsQuery } from "@/features/api/departmentApi";
import { PieChart as RechartsPieChart, Pie, Cell, } from "recharts";
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const ReportGenerator = () => {

  const [dateRange, setDateRange] = useState<"current" | "last" | "custom">("current");
  const [startDate, setStartDate] = useState<Date>(subMonths(new Date(), 1));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [reportType, setReportType] = useState("summary");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const { data: managerDashboard } = useGetManagerDashboardQuery({
    department: departmentFilter === "all" ? "all" : departmentFilter
  })
  const { data: departments } = useGetAllDepartmentsQuery()


  const handleExportReport = (format: "pdf" | "excel" | "csv") => {
    toast({
      title: `Export to ${format.toUpperCase()}`,
      description: `Report has been exported to ${format.toUpperCase()} format`,
    });
  };

  const monthlyData = managerDashboard?.dashboard && Object?.entries(managerDashboard?.dashboard?.leaveTypeMonthlyStats)
    ?.sort(([a], [b]) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months.indexOf(a) - months.indexOf(b);
    })
    ?.map(([key, value]) => ({
      month: key,
      annual: value.ANNUAL || 0,
      sick: value.SICK || 0,
      personal: value.PERSONAL || 0,
      unpaid: value.UNPAID || 0,
      other: value.OTHER || 0,
      paternity: value.PATERNITY || 0,
      maternity: value.MATERNITY || 0,
      total: (value.ANNUAL || 0) + (value.SICK || 0) + (value.PERSONAL || 0) + (value.UNPAID || 0) + (value.OTHER || 0) + (value.PATERNITY || 0) + (value.MATERNITY || 0)
    }));

  const transformDataForPieChart = (data: any) => {
    if (!data) return [];

    const departments = Object.entries(data).map(([department, stats]: [string, any]) => {
      const totalDays = Object.values(stats).reduce((sum: number, days: any) => sum + (days || 0), 0);
      return {
        name: department.charAt(0).toUpperCase() + department.slice(1),
        value: totalDays
      };
    });

    return departments;
  };

  const pieChartData = transformDataForPieChart(managerDashboard?.dashboard?.departmentLeaveDays);



  const ratiosOfLeave = (number: number) => (number * 100).toFixed(2);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start flex-col sm:flex-row gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Leave Ratings</h2>
          <p className="text-muted-foreground">
            Reports for Leave Usage, Balances, and more
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ratings Of Leaves Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Approved</div>
                <div className="text-sm font-medium">{
                  managerDashboard?.dashboard.statusCounts?.APPROVED || 0
                }</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Rejected</div>
                <div className="text-sm font-medium">{
                  managerDashboard?.dashboard.statusCounts?.REJECTED || 0
                }</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Cancelled</div>
                <div className="text-sm font-medium">{
                  managerDashboard?.dashboard.statusCounts?.CANCELLED || 0
                }</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Pending</div>
                <div className="text-sm font-medium">{
                  managerDashboard?.dashboard.statusCounts?.PENDING || 0
                }</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ratio Of Leaves Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Approved</div>
                <div className="text-sm font-medium">{
                  ratiosOfLeave(managerDashboard?.dashboard?.statusRatios?.APPROVED || 0) + " %"
                }</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Rejected</div>
                <div className="text-sm font-medium">{
                  ratiosOfLeave(managerDashboard?.dashboard?.statusRatios?.REJECTED || 0) + " %"
                }</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Cancelled</div>
                <div className="text-sm font-medium">{
                  ratiosOfLeave(managerDashboard?.dashboard?.statusRatios?.CANCELLED || 0) + " %"
                }</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Pending</div>
                <div className="text-sm font-medium">{
                  ratiosOfLeave(managerDashboard?.dashboard?.statusRatios?.PENDING || 0) + " %"
                }</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Days Off</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{
              managerDashboard?.dashboard?.statusCounts.APPROVED || 0
            }</div>
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
                  {departments?.departments?.map((department) => (
                    <SelectItem key={department.id} value={department.id}>{department.name}</SelectItem>
                  ))}
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
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="chart" onClick={() => setReportType("summary")}>
                <BarChart4 className="h-4 w-4 mr-2" />
                Chart View
              </TabsTrigger>
              <TabsTrigger value="department" onClick={() => setReportType("department")}>
                <Users className="h-4 w-4 mr-2" />
                Department
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
                    <Bar dataKey="unpaid" name="Unpaid Leave" fill="#f59e0b" />
                    <Bar dataKey="other" name="Other Leave" fill="#10b981" />
                    <Bar dataKey="paternity" name="Paternity Leave" fill="#22d3ee" />
                    <Bar dataKey="maternity" name="Maternity Leave" fill="#f43f5e" />
                    <Bar dataKey="total" name="Total Days" fill="#000000" />
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
                      <TableHead>Unpaid Leave</TableHead>
                      <TableHead>Other Leave</TableHead>
                      <TableHead>Paternity Leave</TableHead>
                      <TableHead>Maternity Leave</TableHead>

                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {managerDashboard?.dashboard && Object.entries(managerDashboard?.dashboard?.departmentLeaveDays).map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell className="font-medium">{key?.toLocaleUpperCase()}</TableCell>
                        <TableCell>{value.ANNUAL || 0} days</TableCell>
                        <TableCell>{value.SICK || 0} days</TableCell>
                        <TableCell>{value.PERSONAL || 0} days</TableCell>
                        <TableCell>{value.UNPAID || 0} days</TableCell>
                        <TableCell>{value.OTHER || 0} days</TableCell>
                        <TableCell>{value.PATERNITY || 0} days</TableCell>
                        <TableCell>{value.MATERNITY || 0} days</TableCell>
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-medium">
            <PieChart className="h-5 w-5" />
            Leave Distribution by Department
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value} Leave `, 'Total Leaves']}
                />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportGenerator;
