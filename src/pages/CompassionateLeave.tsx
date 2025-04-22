import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import CompassionateLeaveRequestForm from "@/components/leave/CompassionateLeaveRequestForm";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCancelCompassionateLeaveMutation, useGetCompassionateLeaveQuery } from "@/features/api";
import LeaveStatusBadge from "@/components/leave/LeaveStatusBadge";
import { Eye } from "lucide-react";
import { LeaveStatus } from "@/types";
import CompassionateLeaveDetailsCard from "@/components/leave/CompassionateLeaveDetailsCard";
import { toast } from "@/hooks/use-toast";

const CompassionateLeave = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [status, setStatus] = useState("pending");
    const [selectedLeave, setSelectedLeave] = useState<any>(null);
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const { data: compassionateLeave, refetch } = useGetCompassionateLeaveQuery({ status: status.toUpperCase() },
        {
            refetchOnFocus: true,
            refetchOnMountOrArgChange: true,
        });
    const [cancelCompassionateLeave, { isLoading: isCancelling, isSuccess: isCancelled }] = useCancelCompassionateLeaveMutation();

    const handleViewDetails = (leave: any) => {
        setSelectedLeave(leave);
        setShowDetailsDialog(true);
    };

    useEffect(() => {
        if (isCancelled) {
            refetch();
        }
        if (!isRequestModalOpen) {
            refetch();
        }
    }, [isCancelled, isRequestModalOpen, refetch]);

    const handleCancel = (id: string) => {
        if (isCancelling) return;
        cancelCompassionateLeave({ id }).unwrap().then(() => {
            toast({
                title: "Compassionate leave cancelled successfully",
                description: "The compassionate leave has been cancelled successfully",
                variant: "success",
            })
        }).catch((error) => {
            toast({
                title: "Failed to cancel compassionate leave",
                description: "The compassionate leave has been cancelled successfully",
                variant: "destructive",
            });
        });
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };
    return (
        <>
            <Helmet>
                <title>Compassionate Leave - IST Africa</title>
            </Helmet>
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <div className="flex flex-1">
                    <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                    <main className="flex-1 p-6 md:ml-64 transition-all duration-300">
                        <div className="container mx-auto max-w-4xl">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold">Compassionate Leave</h1>
                                <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
                                    <DialogTrigger asChild>
                                        <Button>Request Compassionate Leave</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[600px]">
                                        <DialogHeader>
                                            <DialogTitle>Request Compassionate Leave</DialogTitle>
                                        </DialogHeader>
                                        <CompassionateLeaveRequestForm
                                            setIsRequestModalOpen={setIsRequestModalOpen}
                                        />
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium">About Compassionate Leave</h3>
                                        <p className="text-gray-600">
                                            Compassionate leave is granted for bereavement or other compassionate circumstances.
                                            This type of leave can only be taken on weekends and holidays to minimize impact on work.
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="p-4 bg-blue-50 rounded-lg">
                                                <h4 className="font-medium mb-2">Eligibility</h4>
                                                <ul className="list-disc list-inside text-sm text-gray-600">
                                                    <li>Available to all employees</li>
                                                    <li>Maximum 5 days per year</li>
                                                    <li>Requires manager approval</li>
                                                </ul>
                                            </div>
                                            <div className="p-4 bg-blue-50 rounded-lg">
                                                <h4 className="font-medium mb-2">Documentation</h4>
                                                <ul className="list-disc list-inside text-sm text-gray-600">
                                                    <li>Manager's approval</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="mt-4">
                                <CardContent>
                                    <div className="flex justify-between items-center ">
                                        <h2 className="text-lg font-medium">Compassionate Leaves</h2>
                                        <Select
                                            value={status}
                                            onValueChange={setStatus}
                                        >
                                            <SelectTrigger className="w-[200px] mt-4">
                                                <SelectValue placeholder="Select a compassionate leave By Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="approved">Approved</SelectItem>
                                                <SelectItem value="rejected">Rejected</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="rounded-sm  border mt-4">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>
                                                        <div className="flex items-center gap-1">
                                                            Compassionate Date
                                                        </div>
                                                    </TableHead>
                                                    <TableHead>
                                                        <div className="flex items-center gap-1">
                                                            Reason
                                                        </div>
                                                    </TableHead>
                                                    <TableHead>
                                                        <div className="flex items-center gap-1">
                                                            Status
                                                        </div>
                                                    </TableHead>
                                                    <TableHead>
                                                        <div className="flex items-center gap-1">
                                                            Action
                                                        </div>
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {compassionateLeave?.compassion_requests.map((leave) => (
                                                    <TableRow key={leave.id}>
                                                        <TableCell>{formatDate(leave.workDate)}</TableCell>
                                                        <TableCell>{leave.reason}</TableCell>
                                                        <TableCell>
                                                            <LeaveStatusBadge status={leave.status.toLowerCase() as LeaveStatus} />
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 w-8 p-0"
                                                                    onClick={() => handleViewDetails(leave)}
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>

                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                {compassionateLeave?.compassion_requests.length === 0 && (
                                                    <TableRow>
                                                        <TableCell colSpan={4} className="text-center">No compassionate leave found</TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </main>
                </div>
                <Footer />
            </div>

            {/* Leave Details Dialog */}
            <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Compassionate Leave Details</DialogTitle>
                    </DialogHeader>
                    {selectedLeave && (
                        <CompassionateLeaveDetailsCard
                            request={selectedLeave}
                            onCancel={(id) => {
                                handleCancel(id);
                                setShowDetailsDialog(false);
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CompassionateLeave; 