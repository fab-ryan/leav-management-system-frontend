import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Download } from 'lucide-react';

interface LeaveRequest {
    id: string;
    employeeName: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    status: 'pending' | 'approved' | 'rejected';
    reason: string;
}

const Manager = () => {
    const [activeTab, setActiveTab] = useState('pending');
    const [searchQuery, setSearchQuery] = useState('');

    // Mock data - replace with actual API call
    const leaveRequests: LeaveRequest[] = [
        {
            id: '1',
            employeeName: 'John Doe',
            leaveType: 'Annual Leave',
            startDate: '2024-04-20',
            endDate: '2024-04-25',
            status: 'pending',
            reason: 'Family vacation',
        },
        {
            id: '2',
            employeeName: 'Jane Smith',
            leaveType: 'Sick Leave',
            startDate: '2024-04-18',
            endDate: '2024-04-19',
            status: 'approved',
            reason: 'Medical appointment',
        },
    ];

    const filteredRequests = leaveRequests.filter(request =>
        request.status === activeTab &&
        (request.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            request.leaveType.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="secondary">Pending</Badge>;
            case 'approved':
                return <Badge variant="success">Approved</Badge>;
            case 'rejected':
                return <Badge variant="destructive">Rejected</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manager Dashboard</h1>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                    <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">24</div>
                        <p className="text-xs text-muted-foreground">+12% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8</div>
                        <p className="text-xs text-muted-foreground">+2 from last week</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Approved</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">14</div>
                        <p className="text-xs text-muted-foreground">+4 from last week</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2</div>
                        <p className="text-xs text-muted-foreground">-1 from last week</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Leave Requests</CardTitle>
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search requests..."
                                className="pl-8 w-[300px]"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="mb-4">
                            <TabsTrigger value="pending">Pending</TabsTrigger>
                            <TabsTrigger value="approved">Approved</TabsTrigger>
                            <TabsTrigger value="rejected">Rejected</TabsTrigger>
                        </TabsList>
                        <TabsContent value={activeTab}>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Employee</TableHead>
                                        <TableHead>Leave Type</TableHead>
                                        <TableHead>Start Date</TableHead>
                                        <TableHead>End Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredRequests.map((request) => (
                                        <TableRow key={request.id}>
                                            <TableCell>{request.employeeName}</TableCell>
                                            <TableCell>{request.leaveType}</TableCell>
                                            <TableCell>{request.startDate}</TableCell>
                                            <TableCell>{request.endDate}</TableCell>
                                            <TableCell>{getStatusBadge(request.status)}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm">
                                                        View
                                                    </Button>
                                                    {request.status === 'pending' && (
                                                        <>
                                                            <Button variant="default" size="sm">
                                                                Approve
                                                            </Button>
                                                            <Button variant="destructive" size="sm">
                                                                Reject
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
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

export default Manager;