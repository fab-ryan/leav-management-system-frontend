import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Download, Calendar, Users, BarChart2, PieChart, ArrowUpDown } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ReportData {
    id: string;
    department: string;
    totalEmployees: number;
    totalLeaves: number;
    approvedLeaves: number;
    pendingLeaves: number;
    rejectedLeaves: number;
    averageLeaveDays: number;
}

type SortField = 'department' | 'totalEmployees' | 'totalLeaves' | 'approvedLeaves' | 'pendingLeaves' | 'rejectedLeaves' | 'averageLeaveDays';
type SortDirection = 'asc' | 'desc';

const Reports = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [timeRange, setTimeRange] = useState('month');
    const [department, setDepartment] = useState('all');
    const [sortField, setSortField] = useState<SortField>('department');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    // Mock data - replace with actual API call
    const reportData: ReportData[] = [
        {
            id: '1',
            department: 'Engineering',
            totalEmployees: 25,
            totalLeaves: 45,
            approvedLeaves: 35,
            pendingLeaves: 5,
            rejectedLeaves: 5,
            averageLeaveDays: 3.2,
        },
        {
            id: '2',
            department: 'Marketing',
            totalEmployees: 15,
            totalLeaves: 30,
            approvedLeaves: 25,
            pendingLeaves: 3,
            rejectedLeaves: 2,
            averageLeaveDays: 2.8,
        },
        {
            id: '3',
            department: 'HR',
            totalEmployees: 10,
            totalLeaves: 20,
            approvedLeaves: 15,
            pendingLeaves: 3,
            rejectedLeaves: 2,
            averageLeaveDays: 2.5,
        },
        {
            id: '4',
            department: 'Finance',
            totalEmployees: 12,
            totalLeaves: 25,
            approvedLeaves: 20,
            pendingLeaves: 3,
            rejectedLeaves: 2,
            averageLeaveDays: 2.7,
        },
    ];

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const sortedData = [...reportData].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        const direction = sortDirection === 'asc' ? 1 : -1;

        if (typeof aValue === 'string') {
            return direction * aValue.localeCompare(bValue as string);
        }
        return direction * (aValue - (bValue as number));
    });

    const SortableHeader = ({ field, label }: { field: SortField; label: string }) => (
        <TableHead className="cursor-pointer" onClick={() => handleSort(field)}>
            <div className="flex items-center">
                {label}
                <ArrowUpDown className="ml-2 h-4 w-4" />
                {sortField === field && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
            </div>
        </TableHead>
    );

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Reports & Analytics</h1>
                <div className="flex gap-2">
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select time range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="week">Last Week</SelectItem>
                            <SelectItem value="month">Last Month</SelectItem>
                            <SelectItem value="quarter">Last Quarter</SelectItem>
                            <SelectItem value="year">Last Year</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={department} onValueChange={setDepartment}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Departments</SelectItem>
                            <SelectItem value="engineering">Engineering</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="hr">HR</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">150</div>
                        <p className="text-xs text-muted-foreground">+5% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Leaves</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">245</div>
                        <p className="text-xs text-muted-foreground">+12% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
                        <PieChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">85%</div>
                        <p className="text-xs text-muted-foreground">+2% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Leave Days</CardTitle>
                        <BarChart2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3.2</div>
                        <p className="text-xs text-muted-foreground">-0.5 from last month</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Department-wise Analysis</CardTitle>
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search departments..."
                                className="pl-8 w-[300px]"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="mb-4">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="leaves">Leave Analysis</TabsTrigger>
                            <TabsTrigger value="trends">Trends</TabsTrigger>
                        </TabsList>
                        <TabsContent value={activeTab}>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <SortableHeader field="department" label="Department" />
                                        <SortableHeader field="totalEmployees" label="Total Employees" />
                                        <SortableHeader field="totalLeaves" label="Total Leaves" />
                                        <SortableHeader field="approvedLeaves" label="Approved" />
                                        <SortableHeader field="pendingLeaves" label="Pending" />
                                        <SortableHeader field="rejectedLeaves" label="Rejected" />
                                        <SortableHeader field="averageLeaveDays" label="Avg. Leave Days" />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sortedData.map((data) => (
                                        <TableRow key={data.id}>
                                            <TableCell>{data.department}</TableCell>
                                            <TableCell>{data.totalEmployees}</TableCell>
                                            <TableCell>{data.totalLeaves}</TableCell>
                                            <TableCell>
                                                <Badge variant="default">{data.approvedLeaves}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">{data.pendingLeaves}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="destructive">{data.rejectedLeaves}</Badge>
                                            </TableCell>
                                            <TableCell>{data.averageLeaveDays}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default Reports; 