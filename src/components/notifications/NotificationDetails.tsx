import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Notification } from "@/types";

interface NotificationDetailsProps {
    notification: Notification | null;
    isOpen: boolean;
    onClose: () => void;
}

export const NotificationDetails = ({ notification, isOpen, onClose }: NotificationDetailsProps) => {
    if (!notification) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">{notification.title}</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        {format(new Date(notification.createdAt), "MMM dd, yyyy h:mm a")}
                    </p>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="text-foreground">
                        {notification.message}
                    </div>
                    {notification.type && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Type:</span>
                            <span className="text-sm text-muted-foreground">{notification.type}</span>
                        </div>
                    )}
                    {notification?.employee?.id && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Related to:</span>
                            <span className="text-sm text-muted-foreground">{notification?.employee?.name}</span>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}; 